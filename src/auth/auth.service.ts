import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(body: { email: string; password: string }) {
    console.log('LOGIN BODY:', body);

    const user = await this.prisma.user.findUnique({
      where: { email: body.email },
    });

    console.log('USER DB:', user);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // 🔐 Comparar password encriptado
    const isMatch = await bcrypt.compare(body.password, user.password);

    if (!isMatch) {
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