import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class OrganizationService {
  constructor(private prisma: PrismaService) {}

  async create(name: string, userId: string) {
    return this.prisma.organization.create({
      data: {
        name,
        users: {
          // ✅ relación correcta (1:N)
          connect: { id: userId },
        },
      },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            role: true,
            organizationId: true,
            // ❌ nunca exponer password
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.organization.findMany({
      include: {
        users: {
          select: {
            id: true,
            email: true,
            role: true,
            organizationId: true,
          },
        },
      },
    });
  }
}