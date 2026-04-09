import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data: { email: string; password: string }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
        },
      });

      return {
        id: user.id,
        email: user.email,
        // 🔥 ya no role aquí
      };
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('El email ya está registrado');
      }
      throw error;
    }
  }

  async login(data: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 🔥 obtener rol desde membership
    const membership = await this.prisma.membership.findFirst({
      where: { userId: user.id },
    });

    const role = membership?.role || 'USER';

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role, // 🔥 ahora viene de membership
    });

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        role,
      },
    };
  }
}