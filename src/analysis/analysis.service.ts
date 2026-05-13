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
        const page = await this.prisma.page.findUnique({
             where: { id: pageId },
             include: { parsedContent: true },
            });
        if (!page) throw new Error(`Page ${pageId} not found`);
        if (!page.parsedContent) throw new Error(`No Parsed content for page $(pageId)`);

        const prompt = ANALYSIS_PROMPT.replace('{url}',page.url)
                                    .replace('{metadata}', JSON.stringify(page.parsedContent.metadata))
                                    .replace('{content}', page.parsedContent.mainText.slice(0,3000));

        const parsed = await this.llm.completeJson(prompt);

        if ( !parsed.content ) {
            throw new Error(`AI response missing required fields: ${parsed}`);
        }

        await this.prisma.analysis.upsert({
            where: { pageId_model: { pageId, model: 'llm' } },
            update: { content: parsed.content },
            create: { pageId, model: 'llm', content: parsed.content },
        });

        console.log(`Page Analysis Complete for ${page.title} - ${page.url}`);
    }
}