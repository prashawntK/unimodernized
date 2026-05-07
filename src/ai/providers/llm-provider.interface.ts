export interface LlmProvider {
    complete(prompt: string, model?: string): Promise<string>;
}

export const LLM_PROVIDER = 'LLM_PROVIDER';
