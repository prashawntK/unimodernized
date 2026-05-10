import { Module } from "@nestjs/common";
import { ProjectsModule } from "src/projects/projects.module";
import { CrawlerService } from "./crawler.service";
import { CrawlerController } from "./crawler.controller";
import { CrawlerProcessor } from "./crawler.processor";
import { PagesModule } from "src/pages/pages.module";
import { ParserModule } from "src/parser/parser.module";
import { BrandModule } from "src/brand/brand.module";
import { AccessibilityModule } from "src/accessibility/accessibility.module";

@Module({ 
    imports : [ProjectsModule, PagesModule, ParserModule, BrandModule,AccessibilityModule],
    controllers: [CrawlerController],
    providers: [CrawlerService, CrawlerProcessor],
})
export class CrawlerModule{}