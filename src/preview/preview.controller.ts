import { Controller, Get, Header, Param, Req } from '@nestjs/common';
import { PreviewService } from './preview.service';
import { PagesService } from 'src/pages/pages.service';

@Controller('preview')
export class PreviewController {
    constructor(
        private previewService: PreviewService, 
        private pageService: PagesService,

    ) {}

    @Get(':projectId/:pageId')
    @Header('Content-Type', 'text/html')
    async getPreview(
        @Param('projectId') projectId: string,
        @Param('pageId') pageId: string,
        @Req() req,
    ): Promise<string> {
        await this.pageService.checkPageOwnership(pageId,req.user.sub);
        return this.previewService.getModernizedHtml(projectId, pageId);
    }
}
