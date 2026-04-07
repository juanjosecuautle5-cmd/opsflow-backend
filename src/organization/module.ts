import { Module } from '@nestjs/common';
import { OrganizationService } from './service';
import { OrganizationController } from './controller';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule], // 🔥 importante
  controllers: [OrganizationController],
  providers: [OrganizationService],
})
export class OrganizationModule {}