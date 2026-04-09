import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class OrganizationService {
  constructor(private prisma: PrismaService) {}

  // ✅ Crear organización + ADMIN automático
  async create(name: string, userId: string) {
    return this.prisma.organization.create({
      data: {
        name,
        memberships: {
          create: {
            userId,
            role: 'ADMIN',
          },
        },
      },
      include: {
        memberships: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  // ✅ Todas (debug)
  async findAll() {
    return this.prisma.organization.findMany({
      include: {
        memberships: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  // ✅ Mis organizaciones
  async findMyOrganizations(userId: string) {
    return this.prisma.organization.findMany({
      where: {
        memberships: {
          some: {
            userId,
          },
        },
      },
      include: {
        memberships: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  // 🔥 Obtener usuarios de una org
  async getUsersFromOrganization(organizationId: string) {
    return this.prisma.membership.findMany({
      where: {
        organizationId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  // 🔥 AGREGAR USUARIO A ORGANIZACIÓN (NUEVO)
  async addUserToOrganization(
    organizationId: string,
    userId: string,
  ) {
    return this.prisma.membership.create({
      data: {
        userId,
        organizationId,
        role: 'USER',
      },
    });
  }

  // 🔥 CAMBIAR ROLE
  async changeUserRole(
    organizationId: string,
    userId: string,
    role: 'ADMIN' | 'USER',
  ) {
    return this.prisma.membership.update({
      where: {
        userId_organizationId: {
          userId,
          organizationId,
        },
      },
      data: {
        role,
      },
    });
  }

  // 🔥 DELETE ORGANIZATION
  async deleteOrganization(organizationId: string) {
    await this.prisma.membership.deleteMany({
      where: {
        organizationId,
      },
    });

    return this.prisma.organization.delete({
      where: {
        id: organizationId,
      },
    });
  }
}