import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      'permission',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) return true;

    const orgId =
      request.params.orgId ||
      request.body.organizationId ||
      request.query.organizationId;

    if (!orgId) return false;

    const membership = await this.prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId: user.sub,
          organizationId: orgId,
        },
      },
    });

    if (!membership) return false;

    return requiredPermissions.some((permission) =>
      (membership.permissions || []).includes(permission),
    );
  }
}