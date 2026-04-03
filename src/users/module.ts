import { Module } from '@nestjs/common';
import { UsersService } from './service';
import { UsersController } from './controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
})
export class UsersModule {}