import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async create(@Body() body: { email: string; password: string }) {
    return this.usersService.create(body);
  }
}