import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
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
  @Roles('ADMIN') // ✅ CORRECTO
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}