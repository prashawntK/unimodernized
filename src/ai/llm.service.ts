import { Inject, Injectable } from '@nestjs/common';
import { LLM_PROVIDER, LlmProvider } from './providers/llm-provider.interface';

@Injectable()
export class LlmService {
    constructor(
        @Inject(LLM_PROVIDER) private provider: LlmProvider,
    ) {}

    async complete(prompt: string, model?: string): Promise<string> {
        return this.provider.complete(prompt, model);
    }
}
