import {
  Controller,
  Post,
  Get,
  Body,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // signup route
  @Post('signup')
  createUser(@Body() userData: AuthDto) {
    return this.authService.signup(userData);
  }

  // signin route
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() userData: AuthDto) {
    return this.authService.signin(userData);
  }
}
