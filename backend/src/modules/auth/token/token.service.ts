import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload, Tokens } from 'src/shared/types/jwt-token.type';

@Injectable()
export class TokenService {
  public constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async generate(payload: TokenPayload): Promise<Tokens | null> {
    try {
      return {
        accessToken: await this.jwtService.signAsync(payload, {
          expiresIn: '15m',
          algorithm: 'HS256',
          secret: this.configService.getOrThrow<string>('ACCESS_SECRET'),
        }),
        refreshToken: await this.jwtService.signAsync(payload, {
          expiresIn: '7d',
          algorithm: 'HS256',
          secret: this.configService.getOrThrow<string>('REFRESH_SECRET'),
        }),
      };
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  public async verify(
    token: string,
    secret: string,
  ): Promise<TokenPayload | null> {
    try {
      return await this.jwtService.verifyAsync<TokenPayload>(token, { secret });
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
