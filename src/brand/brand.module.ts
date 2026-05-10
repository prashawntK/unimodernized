import { Module } from '@nestjs/common';
import { BrandExtractorService } from './brand-extractor.service';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  providers: [BrandExtractorService],
  exports: [BrandExtractorService],
  imports: [PrismaModule]
})
export class BrandModule {}
