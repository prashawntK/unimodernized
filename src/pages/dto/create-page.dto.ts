import { IsString, IsNotEmpty, IsInt, IsOptional  } from "class-validator";

export class CreatePageDto{
    @IsString()
    @IsNotEmpty()
    projectId!: string;

    @IsString()
    @IsNotEmpty()
    url!: string;

    @IsString()
    @IsOptional()
    parentUrl!: string | null;


    @IsString()
    @IsNotEmpty()
    path!: string;

    @IsString()
    @IsOptional()
    title!: string | null;

    @IsString()
    @IsNotEmpty()
    rawHtml!: string;

    @IsInt()
    depth!: number;

    @IsInt()
    statusCode!: number;

    @IsString()
    @IsNotEmpty()
    contentHash!: string;

}