import { IsNotEmpty, IsString } from "class-validator";

export class StartCrawlDto{
    @IsString()
    @IsNotEmpty()
    projectId!: string;
}

