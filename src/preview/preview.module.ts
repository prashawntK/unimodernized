import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { PreviewController } from './preview.controller';
import { PreviewService } from './preview.service';
import { PagesModule } from 'src/pages/pages.module';

@Module({
    imports: [PrismaModule, PagesModule],
    controllers: [PreviewController],
    providers: [PreviewService],
})
export class PreviewModule {}
