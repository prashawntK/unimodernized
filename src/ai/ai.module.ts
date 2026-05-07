import { Module } from '@nestjs/common';
import { LlmService } from './llm.service';
import { OpenRouterProvider } from './providers/open-router.provider';
import { LLM_PROVIDER } from './providers/llm-provider.interface';

@Module({
    providers: [
        LlmService,
        {
            provide: LLM_PROVIDER,
            useClass: OpenRouterProvider,
        },
    ],
    exports: [LlmService],
})
export class AiModule {}
