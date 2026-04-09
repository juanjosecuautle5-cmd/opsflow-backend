import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // ✅ Crear usuario (con validación)
  async create(data: { email: string; password: string }) {
    const { email, password } = data;

    // 🔥 Validación básica
    if (!email || !password) {
      throw new BadRequestException('Email y password son requeridos');
    }

    // 🔥 Verificar si ya existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('El usuario ya existe');
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
      },
    });
  }

  // ✅ Obtener todos (SOLO DEBUG)
  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
      },
    });
  }

  // 🔥 Obtener usuario por email (para login)
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // 🔥 Obtener usuario por ID
  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
      },
    });
  }
}