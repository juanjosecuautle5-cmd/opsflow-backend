import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrganizationService } from './service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { OrgRoleGuard } from '../auth/org-role.guard';

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly service: OrganizationService) {}

  // ✅ Crear organización
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: { name: string }, @Req() req: any) {
    const userId = req.user.sub;
    return this.service.create(body.name, userId);
  }

  // ✅ Ver todas (debug)
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // ✅ Mis organizaciones
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyOrganizations(@Req() req: any) {
    const userId = req.user.sub;
    return this.service.findMyOrganizations(userId);
  }

  // 🔥 AGREGAR USUARIO A ORG (NUEVO)
  @UseGuards(JwtAuthGuard, OrgRoleGuard)
  @Post(':orgId/users')
  addUser(
    @Param('orgId') orgId: string,
    @Body() body: { userId: string },
  ) {
    return this.service.addUserToOrganization(orgId, body.userId);
  }

  // 🔥 VER USUARIOS DE UNA ORG
  @UseGuards(JwtAuthGuard, OrgRoleGuard)
  @Get(':orgId/users')
  getUsersFromOrganization(@Param('orgId') orgId: string) {
    return this.service.getUsersFromOrganization(orgId);
  }

  // 🔥 CAMBIAR ROLE
  @UseGuards(JwtAuthGuard, OrgRoleGuard)
  @Patch(':orgId/users/:userId/role')
  changeUserRole(
    @Param('orgId') orgId: string,
    @Param('userId') userId: string,
    @Body() body: { role: 'ADMIN' | 'USER' },
  ) {
    return this.service.changeUserRole(orgId, userId, body.role);
  }

  // 🔥 DELETE ORGANIZATION
  @UseGuards(JwtAuthGuard, OrgRoleGuard)
  @Delete(':orgId')
  deleteOrganization(@Param('orgId') orgId: string) {
    return this.service.deleteOrganization(orgId);
  }
}