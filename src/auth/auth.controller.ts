import { Controller, Post, Get, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup() {
    return this.authService.signup();
  }

  @Post('signin')
  signin() {
    return this.authService.signin();
  }

  @Get('check-password-hash')
  checkPasswordHashing() {
    return this.authService.checkUserPasswordHashing();
  }

  @Post('test-user-data')
  testUserRegistrationData(@Body() userData: AuthDto) {
    console.log('User Email:', userData.email);
    console.log('User Password:', userData.password);
    return {
      message: 'User registration data received!',
      receivedData: userData,
    };
  }
}
