import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProjectsModule } from './projects/projects.module';
import { CrawlerModule } from './crawler/crawler.module';
import { AnalysisModule } from './analysis/analysis.module';
import { RedesignModule } from './redesign/redesign.module';
import { ParserModule } from './parser/parser.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { BrandModule } from './brand/brand.module';
import { PreviewModule } from './preview/preview.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ProjectsModule,
    CrawlerModule,
    AnalysisModule,
    RedesignModule,
    ParserModule,
    PrismaModule,
    BrandModule,
    PreviewModule,
  ],
})
export class AppModule {}
