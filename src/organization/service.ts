import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as crypto from 'crypto';

// 🔥 PERMISOS POR ROL
const rolePermissionsMap = {
  ADMIN: [
    'user.invite',
    'user.remove',
    'user.role.update',
    'org.view',
  ],
  USER: ['org.view'],
};

@Injectable()
export class OrganizationService {
  constructor(private prisma: PrismaService) {}

  // ✅ Crear organización
  async create(name: string, userId: string) {
    return this.prisma.organization.create({
      data: {
        name,
        memberships: {
          create: {
            userId,
            role: 'ADMIN',
            permissions: rolePermissionsMap.ADMIN,
          },
        },
      },
      include: {
        memberships: true,
      },
    });
  }

  // ✅ Todas
  async findAll() {
    return this.prisma.organization.findMany({
      include: {
        memberships: true,
      },
    });
  }

  // ✅ Mis organizaciones
  async findMyOrganizations(userId: string) {
    return this.prisma.organization.findMany({
      where: {
        memberships: {
          some: { userId },
        },
      },
      include: {
        memberships: true,
      },
    });
  }

  // 🔥 Usuarios de org
  async getUsersFromOrganization(organizationId: string) {
    return this.prisma.membership.findMany({
      where: { organizationId },
      include: {
        user: {
          select: { id: true, email: true },
        },
      },
    });
  }

  // 🔥 Agregar usuario
  async addUserToOrganization(
    organizationId: string,
    userId: string,
  ) {
    return this.prisma.membership.create({
      data: {
        userId,
        organizationId,
        role: 'USER',
        permissions: rolePermissionsMap.USER,
      },
    });
  }

  // 🔥 Cambiar rol
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
        permissions: rolePermissionsMap[role],
      },
    });
  }

  // 🔥 Eliminar organización
  async deleteOrganization(organizationId: string) {
    await this.prisma.membership.deleteMany({
      where: { organizationId },
    });

    return this.prisma.organization.delete({
      where: { id: organizationId },
    });
  }

  // 🔥 INVITAR USUARIO (⚠️ SIN permissions)
  async inviteUser(
    organizationId: string,
    email: string,
    role: 'ADMIN' | 'USER',
  ) {
    const token = crypto.randomBytes(32).toString('hex');

    return this.prisma.invitation.create({
      data: {
        email,
        organizationId,
        role,
        token,
        // ❌ NO GUARDAMOS permissions AQUÍ
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });
  }

  // 🔥 ACEPTAR INVITACIÓN
  async acceptInvitation(token: string, userId: string) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { token },
    });

    if (!invitation) throw new Error('Invitación inválida');
    if (invitation.accepted) throw new Error('Invitación ya usada');
    if (invitation.expiresAt < new Date())
      throw new Error('Invitación expirada');

    await this.prisma.membership.create({
      data: {
        userId,
        organizationId: invitation.organizationId,
        role: invitation.role,
        permissions: rolePermissionsMap[invitation.role], // 🔥 AQUÍ sí
      },
    });

    await this.prisma.invitation.update({
      where: { token },
      data: { accepted: true },
    });

    return { message: 'Invitación aceptada' };
  }
}