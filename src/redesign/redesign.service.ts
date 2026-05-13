import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { LlmService } from 'src/ai/llm.service';
import { TemplateService } from 'src/design/template.service';
import { REDESIGN_PROMPT } from './prompts/redesign.prompt';

@Injectable()
export class RedesignService {
    constructor(
        private prisma: PrismaService,
        private llm: LlmService,
        private template: TemplateService,
    ) {}

    async redesignPage(pageId: string): Promise<void> {
        const page = await this.prisma.page.findUnique({
            where: { id: pageId },
            include: {
                analysis: true,
                parsedContent: true,
                project: {
                    select: { brandProfile: true },
                },
            },
        });
        if (!page) throw new Error(`Page ${pageId} not found`);
        if (!page.project.brandProfile) throw new Error(`Brand profile not found for page ${pageId}`);
        if (!page.analysis) throw new Error(`No analysis found for page ${pageId}`);
        if (!page.parsedContent) throw new Error(`No parsed content found for page ${pageId}`);

        const prompt = REDESIGN_PROMPT
            .replace('{url}', page.url)
            .replace('{content_analysis}', JSON.stringify(page.analysis.content))
            .replace('{brand}', JSON.stringify(page.project.brandProfile));

        const aiResult = await this.llm.completeJson(prompt);

        if (!aiResult.pageType || !aiResult.layout || !aiResult.colors || !aiResult.typography) {
            throw new Error(`AI response missing required fields: ${JSON.stringify(aiResult)}`);
        }

        const modernizedHtml = this.template.render({
            brand: page.project.brandProfile,
            parsed: page.parsedContent,
            redesign: aiResult,
        });

        await this.prisma.redesign.upsert({
            where: { pageId },
            update: { ...aiResult, modernizedHtml },
            create: { pageId, ...aiResult, modernizedHtml },
        });

        console.log(`Redesign Complete for ${page.title} - ${page.url}`);
    }
}
