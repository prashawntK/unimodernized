import { Controller, Param, Post } from "@nestjs/common";
import { AnalysisService } from "./analysis.service";

@Controller('analyse')
export class AnalysisController{

    constructor(private analysisService: AnalysisService){}
    @Post(':id')
    async analysePage(@Param('id') pageId:string){
        await this.analysisService.analyzePage(pageId);
    }
}