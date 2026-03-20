import { BadRequestException, Injectable } from '@nestjs/common';

import { TokenService } from './token/token.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { LoginAccountDto, RegisterAccountDto } from './dto/auth.dto';
import { HashService } from './hash/hash.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
    private readonly hashService: HashService,
  ) {}

  public async register(
    accountData: RegisterAccountDto,
    res: Response,
  ): Promise<boolean> {
    if (!accountData) {
      throw new BadRequestException('Не удалось создать пользователя');
    }
    try {
      const { username, email, password, password_repeat, phone, avatar } =
        accountData;
      if (password !== password_repeat) {
        throw new BadRequestException('Пароли не совпадают');
      }
      const existingAccount = await this.prismaService.account.findFirst({
        where: { OR: [{ email }, { phone }, { username }] },
      });
      if (existingAccount) {
        if (username === existingAccount.username)
          throw new BadRequestException(
            `Аккаунт с именем ${username} уже существует`,
          );
        if (email === existingAccount.email)
          throw new BadRequestException(
            `Аккаунт с почтой ${email} уже существует`,
          );
        if (phone === existingAccount.phone)
          throw new BadRequestException(
            `Аккаунт с номером ${phone} уже существует`,
          );
      }
      const hashedPassword = await this.hashService.generate(password);
      const data = {
        email,
        phone,
        username,
        avatar,
        password: hashedPassword,
      };
      console.log(data);
      const createdAccount = await this.prismaService.account.create({ data });

      const tokens = await this.tokenService.generate({
        id: createdAccount.id,
        username: createdAccount.username,
        avatar: createdAccount.avatar,
      });
      if (!tokens)
        throw new BadRequestException(
          'Не удалось создать аккаунт, попробуйте снова',
        );
      res.cookie('accessToken', tokens.accessToken, {
        httpOnly: true,
        secure: false,
        maxAge: 15 * 60 * 1000,
      });
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return true;
    } catch (e: unknown) {
      if (e instanceof BadRequestException) {
        throw new BadRequestException(e.message);
      }
      throw e;
    }
  }

  public async login(accountData: LoginAccountDto, res: Response) {
    try {
      const { email, phone, password } = accountData;
      const existingAccount = await this.prismaService.account.findFirst({
        where: { OR: [{ email }, { phone }] },
      });
      if (!existingAccount) {
        throw new BadRequestException('Аккаунт не найден');
      }
      const isPasswordValid = await this.hashService.compare(
        password,
        existingAccount.password,
      );
      if (!isPasswordValid) {
        throw new BadRequestException('Неверный пароль');
      }
      const tokens = await this.tokenService.generate({
        id: existingAccount.id.toString(),
        username: existingAccount.username,
        avatar: existingAccount.avatar,
      });
      if (!tokens)
        throw new BadRequestException(
          'Не удалось войти в аккаунт, попробуйте снова',
        );
      res.cookie('access_token', tokens.accessToken, {
        httpOnly: true,
        secure: false,
        maxAge: 15 * 60 * 1000,
      });
      res.cookie('refresh_token', tokens.refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return true;
    } catch (e: unknown) {
      if (e instanceof BadRequestException) {
        throw new BadRequestException(e.message);
      }
      throw e;
    }
  }

  public async refreshToken(token: string, res: Response) {
    try {
      const payload = await this.tokenService.verify(
        token,
        this.configService.getOrThrow('REFRESH_SECRET'),
      );
      if (!payload)
        throw new BadRequestException(
          'Ваши токены недействительны, авторизируйтесь заново',
        );
      const tokens = await this.tokenService.generate({
        id: payload.id,
        username: payload.username,
        avatar: payload.avatar,
      });
      if (!tokens)
        throw new BadRequestException(
          'Не удалось обновить токен, попробуйте снова',
        );
      res.cookie('access_token', tokens.accessToken, {
        httpOnly: true,
        secure: false,
        maxAge: 15 * 60 * 1000,
      });
      res.cookie('refresh_token', tokens.refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return true;
    } catch (e: unknown) {
      if (e instanceof BadRequestException) {
        throw new BadRequestException(e.message);
      }
      throw e;
    }
  }
}
