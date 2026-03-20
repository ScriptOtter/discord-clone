import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { RegisterAccountDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public async register(
    @Body() accountData: RegisterAccountDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.register(accountData, res);
  }

  @Post('login')
  public async login(
    @Body() accountData: RegisterAccountDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.login(accountData, res);
  }

  @Post('refresh')
  public async refreshToken(
    @Body() dto: { refreshToken: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken } = dto;
    return await this.authService.refreshToken(refreshToken, res);
  }
}
