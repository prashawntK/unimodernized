import {Controller, Post, Get, Body, Param, NotFoundException} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {

    constructor(private projectsService: ProjectsService){}

    @Get(':id')
    async getProject(@Param('id') id: string) {
        const project = await this.projectsService.getProject(id);

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        return project;
    } 

    @Get(':id/pages')
    async getProjectwithRedesign(@Param('id')id:string){
        return this.projectsService.getProjectPages(id);
       // return this.prisma.page.findMany
    }

    @Post()
    async createProject( @Body() dto : CreateProjectDto) {
        return await this.projectsService.createProject(dto);
    }


    @Get()
    async getAllProjects(){
        return this.projectsService.getAllProjects();
    }


}