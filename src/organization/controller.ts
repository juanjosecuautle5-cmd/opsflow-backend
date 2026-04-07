import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrganizationService } from './service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly service: OrganizationService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: { name: string }, @Req() req: any) {
    const userId = req.user.sub;

    return this.service.create(body.name, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.service.findAll();
  }
}