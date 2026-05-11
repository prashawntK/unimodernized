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

    extractJson(raw:string): any{
        const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        const cleaned = fenceMatch ? fenceMatch[1] : raw;

        const start = cleaned.indexOf('{');
        const end = cleaned.lastIndexOf('}');
        if(start ===-1 || end === -1) throw new Error('No JSON object found in LLM response');
        const jsonStr = cleaned.slice(start,end +1);
        return JSON.parse(jsonStr);
    }

    async completeJson(prompt:string, model?:string): Promise<any>{
        for(let attempt = 0;attempt<3;attempt++){
            try{
                const rawResponse = await this.provider.complete(prompt,model);
                return this.extractJson(rawResponse);
            }catch(err){
                if(attempt===2) throw new Error(`LLM failed after 3 attempts: ${err}`);
            }
            
        }

        
    }   
}
