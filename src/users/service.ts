import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(body: { email: string; password: string }) {
    return this.prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
      },
    });
  }

  async getUsers() {
    return this.prisma.user.findMany();
  }
}