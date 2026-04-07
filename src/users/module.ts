import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma.module';
import { UsersService } from './service';
import { UsersController } from './controller';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}