import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { LlmService } from 'src/ai/llm.service';
import { REDESIGN_PROMPT } from './prompts/redesign.prompt';

@Injectable()
export class RedesignService {
    constructor(
        private prisma: PrismaService,
        private llm: LlmService,
    ) {}

    async redesignPage(pageId: string): Promise<void> {
        const page = await this.prisma.page.findUnique({ 
            where: { id: pageId },
            select: {
                url:true,
                rawHtml: true,
                analysis:true,
            },
        });
        if (!page) throw new Error(`Page ${pageId} not found`);

        const prompt = REDESIGN_PROMPT
            .replace('{url}', page.url)
             .replace('{html}', page.rawHtml.slice(0, 5000))
            .replace('{analysis}', JSON.stringify(page.analysis));


        const raw = await this.llm.complete(prompt);
        const parsed = JSON.parse(raw);

        if (!parsed.pageType || !parsed.layout || !parsed.colors || !parsed.typography) {
            throw new Error(`AI response missing required fields: ${raw}`);
        }

        await this.prisma.redesign.upsert({
            where: { pageId },
            update: { ...parsed },
            create: { pageId, ...parsed },
        });
    }
}
