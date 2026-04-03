import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(body: { email: string; password: string }) {
    console.log("LOGIN START");

    const user = await this.prisma.user.findUnique({
      where: { email: body.email },
    });

    console.log("USER:", user);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.password !== body.password) {
      throw new UnauthorizedException('Invalid password');
    }

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }
}