import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  Validate,
  IsPhoneNumber,
  IsNumberString,
} from 'class-validator';
import { IsEitherEmailOrPhone } from 'src/shared/validators/isEitherEmailOrPhone.validator';

export class RegisterAccountDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  email: string;

  phone: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password_repeat: string;
  @IsString()
  avatar: string;
}

export class LoginAccountDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsPhoneNumber()
  phone?: string;

  @IsString()
  @MinLength(8)
  password: string;

  @Validate(IsEitherEmailOrPhone)
  validateEitherField?: any;
}
