import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { LlmProvider } from './llm-provider.interface';

@Injectable()
export class OpenRouterProvider implements LlmProvider {
    private client: OpenAI;
    private defaultModel: string;

    constructor(private config: ConfigService) {
        const apiKey = this.config.get<string>('OPENROUTER_API_KEY');
        const model = this.config.get<string>('OPENROUTER_INCLUSIONAI');

        if (!apiKey) throw new Error('OPENROUTER_API_KEY is not set in .env');
        if (!model) throw new Error('OPENROUTER_INCLUSIONAI is not set in .env');

        this.client = new OpenAI({
            baseURL: 'https://openrouter.ai/api/v1',
            apiKey,
        });
        this.defaultModel = model;
    }

    async complete(prompt: string, model?: string): Promise<string> {
        const response = await this.client.chat.completions.create({
            model: model ?? this.defaultModel,
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant. Always respond with valid JSON only, no markdown, no explanation.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        });

        return response.choices[0].message.content ?? '{}';
    }
}
