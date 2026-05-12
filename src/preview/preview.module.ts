import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { PreviewController } from './preview.controller';
import { PreviewService } from './preview.service';

@Module({
    imports: [PrismaModule],
    controllers: [PreviewController],
    providers: [PreviewService],
})
export class PreviewModule {}
