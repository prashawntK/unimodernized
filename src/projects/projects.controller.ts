import {Controller, Post, Get, Body, Param, NotFoundException} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectsService } from './projects.service';
import { Req } from '@nestjs/common';

@Controller('projects')
export class ProjectsController {

    constructor(private projectsService: ProjectsService){}

    @Get(':id')
    async getProject(@Param('id') id: string, @Req() req) {
        const project = await this.projectsService.getProject(id, req.user.sub);

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        return project;
    } 

    @Get(':id/pages')
    async getProjectwithRedesign(@Param('id')id:string, @Req() req){
        return this.projectsService.getProjectPages(id, req.user.sub);
    }

    @Post()
    async createProject( @Body() dto : CreateProjectDto, @Req() req) {
        return await this.projectsService.createProject(dto, req.user.sub);
    }


    @Get()
    async getAllProjects(@Req() req){
        return this.projectsService.getAllProjects(req.user.sub);
    }


}