import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ✅ PÚBLICO (para crear usuario)
  @Post()
  createUser(@Body() body: { email: string; password: string }) {
    return this.usersService.createUser(body);
  }

  // 🔒 PROTEGIDO
  @UseGuards(JwtAuthGuard)
  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }
}