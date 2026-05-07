import { IsString, IsNotEmpty, IsObject } from 'class-validator';

export class CreateAnalysisDto {
    @IsString()
    @IsNotEmpty()
    pageId!: string;

    @IsObject()
    accessibility!: object;

    @IsObject()
    content!: object;

    @IsObject()
    design!: object;
}
