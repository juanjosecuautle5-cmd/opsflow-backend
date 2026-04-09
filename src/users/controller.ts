import {
  Controller,
  Post,
  Body,
  Get,
} from '@nestjs/common';
import { UsersService } from './service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ✅ Crear usuario (registro)
  @Post()
  create(@Body() body: { email: string; password: string }) {
    return this.usersService.create(body);
  }

  // 🟡 SOLO DEBUG (sin seguridad)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}