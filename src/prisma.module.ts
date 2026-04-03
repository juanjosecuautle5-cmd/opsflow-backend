import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // 👈 ESTO LO ARREGLA TODO
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}