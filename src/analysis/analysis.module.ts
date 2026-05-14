import { Module } from "@nestjs/common";
import { AnalysisService } from "./analysis.service";
import { PrismaModule } from "src/common/prisma/prisma.module";
import { AnalysisProcessor } from "./analysis.processor";
import { AnalysisController } from "./analysis.controller";
import { AiModule } from "src/ai/ai.module";
import { EventsModule } from "src/events/events.module";
import { PagesModule } from "src/pages/pages.module";
@Module({

    imports: [PrismaModule, AiModule, EventsModule, PagesModule],
    providers: [
        AnalysisService,
        AnalysisProcessor,
    ],
    controllers: [AnalysisController],
    exports: [AnalysisService],

})
export class AnalysisModule{

}