import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class OrgRoleGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user = request.user;
    const orgId = request.params.orgId;

    const membership = await this.prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId: user.sub,
          organizationId: orgId,
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException('No perteneces a esta organización');
    }

    if (membership.role !== 'ADMIN') {
      throw new ForbiddenException('No eres ADMIN');
    }

    return true;
  }
}