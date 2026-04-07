import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Patch,
  Param,
} from '@nestjs/common';
import { UsersService } from './service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() body: { email: string; password: string }) {
    return this.usersService.create(body);
  }

  // 🔐 SOLO ADMIN
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // 🔥 CAMBIAR ROLE
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/role')
  changeRole(
    @Param('id') id: string,
    @Body() body: { role: 'ADMIN' | 'USER' },
  ) {
    return this.usersService.changeRole(id, body.role);
  }
}