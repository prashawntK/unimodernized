import { Module } from '@nestjs/common';
import { RedesignService } from './redesign.service';
import { RedesignProcessor } from './redesign.processor';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { AiModule } from 'src/ai/ai.module';
import { RedesignController } from './redesign.controller';
import { DesignModule } from 'src/design/design.module';
import { EventsModule } from 'src/events/events.module';

@Module({
    controllers: [RedesignController],
    imports: [PrismaModule, AiModule, DesignModule, EventsModule],
    providers: [RedesignService, RedesignProcessor],
    exports: [RedesignService],
})
export class RedesignModule {}
