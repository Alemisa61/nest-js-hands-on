import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  providers: [CommonService, PrismaService],
  exports: [CommonService],
  imports: [PrismaModule],
})
export class CommonModule {}
