import { Controller, Get, Header, Param } from '@nestjs/common';
import { PreviewService } from './preview.service';

@Controller('preview')
export class PreviewController {
    constructor(private previewService: PreviewService) {}

    @Get(':projectId/:pageId')
    @Header('Content-Type', 'text/html')
    async getPreview(
        @Param('projectId') projectId: string,
        @Param('pageId') pageId: string,
    ): Promise<string> {
        return this.previewService.getModernizedHtml(projectId, pageId);
    }
}
