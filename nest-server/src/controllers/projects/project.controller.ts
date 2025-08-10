import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectDto } from './dtos/project.dto';
import { CurrentUser } from '@/shared/decorators/user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Project } from '@/models/project.model';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';

@Controller('projects')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser('id') userId: string,
    // Use the `@Body()` decorator and a `ValidationPipe` to validate the incoming DTO.
    @Body(new ValidationPipe()) data: ProjectDto,
  ) {
    const projectMode = plainToInstance(Project, {
      ...data,
      ownerId: data.ownerId ? data.ownerId : userId,
      members: [...(data.members ? data.members : []), userId],
    });
    return this.projectService.create(data);
  }

  @Get()
  async findAll(
    @CurrentUser('id') userId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    return this.projectService.model
      .find({
        $or: [{ ownerId: userId }, { members: userId }],
        deleted: { $ne: true },
      })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  @Get(':id')
  async findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    const project = await this.projectService.findOne({
      $and: [{ id }, { $or: [{ ownerId: userId }, { members: userId }] }],
    });
    if (!project) {
      // Throw a NotFoundException if the project doesn't exist.
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }
    return project;
  }

  @Put(':id')
  async update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    // The `UpdateProjectDto` is used for validation and type safety.
    @Body(new ValidationPipe()) updateProjectDto: ProjectDto,
  ) {
    const project = await this.projectService.findOne({
      $and: [{ id }, { ownerId: userId }],
    });
    if (!project) {
      throw new UnauthorizedException(`Unauthorized`);
    }
    const updatedProject = await this.projectService.update(
      id,
      updateProjectDto,
    );
    if (!updatedProject) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }
    return updatedProject;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    const project = await this.projectService.findOne({
      $and: [{ id }, { ownerId: userId }],
    });
    if (!project) {
      throw new UnauthorizedException(`Unauthorized`);
    }
    const deletedProject = await this.projectService.update(id, {
      deleted: true,
    });
    if (!deletedProject) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }
    // Return a 204 No Content status on successful deletion.
    return;
  }
}
