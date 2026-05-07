import { Module } from '@nestjs/common';
import { RedesignService } from './redesign.service';
import { RedesignProcessor } from './redesign.processor';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { AiModule } from 'src/ai/ai.module';
import { RedesignController } from './redesign.controller';

@Module({
    controllers: [RedesignController],
    imports: [PrismaModule, AiModule],
    providers: [RedesignService, RedesignProcessor],
    exports: [RedesignService],
})
export class RedesignModule {}
