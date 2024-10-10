import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { PickType } from '@nestjs/mapped-types';

export class UserDto {
  constructor() {
    this.role = 'user';
  }

  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @IsPhoneNumber(null)
  @IsOptional()
  phoneNumber?: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsString()
  role?: string;
}

export class SignInDto extends PickType(UserDto, ['email', 'password']) {}
