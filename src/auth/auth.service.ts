import { Injectable } from '@nestjs/common';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  signup() {
    return { message: 'User signed up successfully' };
  }

  signin() {
    return { message: 'User signed in successfully' };
  }

  async checkUserPasswordHashing() {
    const userPassword = '123456';
    const hashedUserPassword = await argon.hash(userPassword);
    console.log('User Original Password:', userPassword);
    console.log('User Hashed Password:', hashedUserPassword);
    return 'User password hashing is working for bookmark API!';
  }
}
