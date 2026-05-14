import { Controller, Param, Post, Req } from "@nestjs/common";
import { AnalysisService } from "./analysis.service";
import { PagesService } from "src/pages/pages.service";

@Controller('analyse')
export class AnalysisController{

    constructor(
        private analysisService: AnalysisService,
        private pageService: PagesService
    ){}

    @Post(':id')
    async analysePage(@Param('id') pageId:string, @Req() req){
        await this.pageService.checkPageOwnership(pageId, req.user.sub);
        await this.analysisService.analyzePage(pageId);
    }
}