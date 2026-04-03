import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: { email: string; password: string }) {
    return this.usersService.create(body.email, body.password);
  }
}