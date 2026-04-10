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
import { PermissionsGuard } from '../auth/permissions.guard';
import { Permission } from '../auth/permissions.decorator';

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

  // 🔐 INVITAR (✔ PASO 3 correcto)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('user.invite')
  @Post(':orgId/invite')
  inviteUser(
    @Param('orgId') orgId: string,
    @Body() body: { email: string; role: 'ADMIN' | 'USER' },
  ) {
    return this.service.inviteUser(orgId, body.email, body.role);
  }

  // 🔥 ACEPTAR INVITACIÓN
  @UseGuards(JwtAuthGuard)
  @Post('accept-invitation')
  acceptInvitation(
    @Body() body: { token: string },
    @Req() req: any,
  ) {
    return this.service.acceptInvitation(body.token, req.user.sub);
  }

  // 🔥 AGREGAR USUARIO
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('user.invite')
  @Post(':orgId/users')
  addUser(
    @Param('orgId') orgId: string,
    @Body() body: { userId: string },
  ) {
    return this.service.addUserToOrganization(orgId, body.userId);
  }

  // 🔥 VER USUARIOS
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('org.view')
  @Get(':orgId/users')
  getUsersFromOrganization(@Param('orgId') orgId: string) {
    return this.service.getUsersFromOrganization(orgId);
  }

  // 🔐 CAMBIAR ROLE (✔ PASO 3 correcto)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('user.role.update')
  @Patch(':orgId/users/:userId/role')
  changeUserRole(
    @Param('orgId') orgId: string,
    @Param('userId') userId: string,
    @Body() body: { role: 'ADMIN' | 'USER' },
  ) {
    return this.service.changeUserRole(orgId, userId, body.role);
  }

  // 🔥 DELETE ORGANIZATION
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('org.delete')
  @Delete(':orgId')
  deleteOrganization(@Param('orgId') orgId: string) {
    return this.service.deleteOrganization(orgId);
  }
}