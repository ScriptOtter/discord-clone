import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenModule } from './token/token.module';
import { TokenService } from './token/token.service';
import { HashService } from './hash/hash.service';
import { IsEitherEmailOrPhone } from 'src/shared/validators/isEitherEmailOrPhone.validator';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Module({
  imports: [TokenModule],
  controllers: [AuthController],
  providers: [
    PrismaService,
    AuthService,
    TokenService,
    IsEitherEmailOrPhone,
    HashService,
  ],
})
export class AuthModule {}
