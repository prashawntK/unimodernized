import { Controller, Param, Post } from "@nestjs/common";
import { RedesignService } from "./redesign.service";

@Controller('redesign')
export class RedesignController{

    constructor(private redesignService: RedesignService){}

    @Post(':id')
    async redesignPage(@Param('id')pageId:string ){
        await this.redesignService.redesignPage(pageId);
    }

}