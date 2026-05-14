import { Controller, Param, Post, Req } from "@nestjs/common";
import { RedesignService } from "./redesign.service";
import { PagesService } from "src/pages/pages.service";

@Controller('redesign')
export class RedesignController{

    constructor(
        private redesignService: RedesignService,
        private pageService: PagesService
    ){}

    @Post(':id')
    async redesignPage(@Param('id')pageId:string, @Req() req ){
        await this.pageService.checkPageOwnership(pageId, req.user.sub);
        await this.redesignService.redesignPage(pageId);
    }

}