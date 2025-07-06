import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { AuthDto } from './dto/auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async signup(userData: AuthDto) {
    const hashedPassword = await argon.hash(userData.password);
    try {
      const newUser = await this.prisma.user.create({
        data: {
          email: userData.email,
          hash: hashedPassword,
        },
      });

      delete (newUser as any).hash;

      return {
        message: 'User created successfully',
        user: newUser,
      };
    } catch (error) {
      throw new ForbiddenException(
        'Email already exists. Try with different email.',
      );
    }
  }

  // Complete signin function
  async signin(userData: AuthDto) {
    console.log('Signin attempt for email:', userData.email);

    // Step 1: user find from database
    const user = await this.prisma.user.findUnique({
      where: {
        email: userData.email,
      },
    });

    // Step 2: if user not found, throw error
    if (!user) {
      console.log('User not found');
      throw new ForbiddenException('Invalid email or password');
    }
    console.log('User found with ID:', user.id);

    // Step 3: Password verify
    const isPasswordCorrect = await argon.verify(user.hash, userData.password);

    if (!isPasswordCorrect) {
      console.log('Password incorrect');
      throw new ForbiddenException('Invalid email or password');
    }

    console.log('Password verified successfully');

    // Step 4: JWT token generation
    const tokenData = {
      userId: user.id,
      email: user.email,
    };

    const token = await this.jwt.signAsync(tokenData);
    console.log('JWT token generated');

    // Step 5: Response return
    return {
      message: 'User signed in successfully!',
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }
}
