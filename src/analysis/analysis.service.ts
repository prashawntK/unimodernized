import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { LlmService } from 'src/ai/llm.service';
import { ANALYSIS_PROMPT } from './prompts/analysis.prompt';

@Injectable()
export class AnalysisService {
    constructor(
        private prisma: PrismaService,
        private llm: LlmService,
    ) {}

    async analyzePage(pageId: string): Promise<void> {
        const page = await this.prisma.page.findUnique({ where: { id: pageId } });
        if (!page) throw new Error(`Page ${pageId} not found`);

        const prompt = ANALYSIS_PROMPT.replace('{url}',page.url)
                                      .replace('{html}',page.rawHtml.slice(0,5000));

        const raw = await this.llm.complete(prompt);
        const parsed = JSON.parse(raw);

        if (!parsed.accessibility || !parsed.content || !parsed.design) {
            throw new Error(`AI response missing required fields: ${raw}`);
        }

        await this.prisma.analysis.upsert({
            where: { pageId_model: { pageId, model: 'llm' } },
            update: { ...parsed },
            create: { pageId, model: 'llm', ...parsed },
        });
    }
}