import { CreateProjectDto } from "./dto/create-project.dto";
import { Injectable } from '@nestjs/common';
import { ProjectStatus } from "@prisma/client";
import { Project } from "@prisma/client";
import { PrismaService } from "src/common/prisma/prisma.service";

@Injectable()
export class ProjectsService{
    constructor(private prisma: PrismaService){}

    async getProject(projectId: string): Promise<Project | null> {
        return this.prisma.project.findUnique({
            where: {id: projectId},
        });
    }

    async updateStatus(projectId: string, status: ProjectStatus): Promise<Project>{
        return this.prisma.project.update({
            where: {id: projectId},
            data: {status},
        });
    }

    async createProject(dto: CreateProjectDto): Promise<Project> {

        return this.prisma.project.create({
            data:{
                name:dto.name,
                sourceUrl:dto.sourceUrl,
                status: ProjectStatus.CREATED
            }
        })
    }

    async getAllProjects(){
        return this.prisma.project.findMany({
            orderBy: { createdAt: 'desc'}
        });
    }

    async getProjectPages(projectId: string){
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