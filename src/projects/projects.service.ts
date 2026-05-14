import { CreateProjectDto } from "./dto/create-project.dto";
import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectStatus } from "@prisma/client";
import { Project } from "@prisma/client";
import { PrismaService } from "src/common/prisma/prisma.service";

@Injectable()
export class ProjectsService{
    constructor(private prisma: PrismaService){}

    async getProjectInternal(projectId: string): Promise<Project | null> {
        return this.prisma.project.findUnique({
            where: {id: projectId},
        });
    }

    async getProject(projectId:string, userId:string){
        const project = await this.prisma.project.findUnique({
            where: {id: projectId, userId},
        });
        if(!project) throw new NotFoundException();
        return project;
    }

    async updateStatus(projectId: string, status: ProjectStatus): Promise<Project>{
        return this.prisma.project.update({
            where: {id: projectId},
            data: {status},
        });
    }

    async createProject(dto: CreateProjectDto, userId:string): Promise<Project> {

        return this.prisma.project.create({
            data:{
                name:dto.name,
                sourceUrl:dto.sourceUrl,
                status: ProjectStatus.CREATED,
                userId,
            }
        })
    }

    async getAllProjects(userId:string){
        return this.prisma.project.findMany({
            where: { userId},
            orderBy: { createdAt: 'desc'}
        });
    }

    async getProjectPages(projectId: string, userId:string){
        await this.getProject(projectId, userId);  //NEED TO TEST
        return this.prisma.page.findMany({
            where : {projectId},
            select: {
                id:true,
                url:true,
                title:true,
                redesign:{
                    select:{
                        pageType:true,
                        layout:true,
                        modernizedHtml:true,
                    }
                }
            },
            orderBy:{createdAt: 'asc'}
        })
    }

    





}