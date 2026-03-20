import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { TokenPayload } from 'src/shared/types/jwt-token.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('ACCESS_SECRET'),
    });
  }

  public async validate(payload: TokenPayload) {
    const user = await this.prismaService.account.findUnique({
      where: { id: payload.id },
    });
    if (!user) {
      throw new Error('Account not found');
    }
    return user;
  }
}
