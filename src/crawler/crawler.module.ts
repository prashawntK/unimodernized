import { Module } from "@nestjs/common";
import { ProjectsModule } from "src/projects/projects.module";
import { CrawlerService } from "./crawler.service";
import { CrawlerController } from "./crawler.controller";
import { CrawlerProcessor } from "./crawler.processor";
import { PagesModule } from "src/pages/pages.module";
import { ParserModule } from "src/parser/parser.module";
import { PrismaModule } from "src/common/prisma/prisma.module";

@Module({ 
    imports : [ProjectsModule, PagesModule, ParserModule],
    controllers: [CrawlerController],
    providers: [CrawlerService, CrawlerProcessor],
})
export class CrawlerModule{}