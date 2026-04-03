import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ✅ SIN GUARD
  @Post()
  createUser(@Body() body: { email: string; password: string }) {
    return this.usersService.createUser(body);
  }

  // 🔒 SOLO AQUÍ (si quieres)
  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }
}