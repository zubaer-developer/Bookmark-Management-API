import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { AuthDto } from './dto/auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Hash } from 'crypto';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

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
}
