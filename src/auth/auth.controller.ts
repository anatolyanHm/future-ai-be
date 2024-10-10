import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignInDto, UserDto } from './dto/auth.dto';
import { PublicMethod } from 'lib/auth/decorators/public.decorator';

@PublicMethod()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUpWithEmail(@Body() signUpDto: UserDto, @Res() res: Response) {
    try {
      const { uid, token } = await this.authService.signUpWithEmail(
        signUpDto.email,
        signUpDto.password,
        signUpDto.role,
      );
      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 864000,
      });
      return res.status(201).json({ uid });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  @Post('sign-in')
  async signInWithEmail(@Body() signInDto: SignInDto, @Res() res: Response) {
    try {
      const token = await this.authService.signInWithEmail(
        signInDto.email,
        signInDto.password,
      );
      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 864000,
      });
      return res.status(200).json({ message: 'Login successful' });
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }
  }
}
