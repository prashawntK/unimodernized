import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class PreviewService {
    constructor(private prisma: PrismaService) {}

    async getModernizedHtml(projectId: string, pageId: string): Promise<string> {
        const page = await this.prisma.page.findFirst({
            where: { id: pageId, projectId },
            include: { redesign: true },
        });

        if (!page) {
            throw new NotFoundException('Page not found');
        }

        if (!page.redesign?.modernizedHtml) {
            throw new NotFoundException('Redesign not generated yet');
        }

        return page.redesign.modernizedHtml;
    }
}
