import { Injectable, NotFoundException } from "@nestjs/common";
import { CreatePageDto } from "./dto/create-page.dto";
import { PrismaService } from "src/common/prisma/prisma.service";
import { Page } from "@prisma/client";


@Injectable()
export class PagesService{
    constructor(private prisma: PrismaService){}

    async createPage(dto: CreatePageDto):Promise<Page>{
        return this.prisma.page.create({data:dto});
    }

    async checkPageOwnership(pageId:string, userId:string){
        const page = await this.prisma.page.findUnique({
            where:{
                id:pageId,
                project: {
                    userId
                }
            }
        });
        if(!page) throw new  NotFoundException();
    }

}