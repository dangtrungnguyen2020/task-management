import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import TaskService from './task.service';
import { CreateTaskDto } from './dtos/create-task.dto';
import { ProjectService } from '../project.service';
import { TaskStatus } from '@/models/task-status.enum';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { CurrentUser } from '@/shared/decorators/user.decorator';
import { JwtAuthGuard } from '@/controllers/auth/strategies/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller('projects/:projectId/tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export default class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly projectService: ProjectService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser('id') userId: string,
    @Param('projectId') projectId: string,
    @Body(new ValidationPipe()) createTaskDto: CreateTaskDto,
  ) {
    const project = this.projectService.findById(projectId);
    if (!project)
      throw new NotFoundException(
        `Fail to create new task. Due to not existed projectId ${projectId}`,
      );
    return this.taskService.create({
      ...createTaskDto,
      projectId: projectId as any,
      status: TaskStatus.TODO,
      assigneeId: createTaskDto.assigneeId ? createTaskDto.assigneeId : userId,
    });
  }

  @Get()
  async findAll(
    @Param('projectId') projectId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const skip = (page - 1) * limit;

    return this.taskService.model
      .find({ projectId, deleted: { $ne: true } })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  @Get(':taskId')
  async findOne(
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
  ) {
    const task = await this.taskService.findById(taskId);
    if (!task && task.projectId != (projectId as any)) {
      throw new NotFoundException(
        `Task with ID "${taskId}" not found in project "${projectId}"`,
      );
    }
    return task;
  }

  @Put(':taskId')
  async update(
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
    @Body(new ValidationPipe()) data: UpdateTaskDto,
  ) {
    try {
      const updatedTask = await this.taskService.model.findOneUpdate(
        { _id: taskId, projectId },
        data,
        { new: true },
      );
      if (!updatedTask) {
        throw new NotFoundException(
          `Task with ID "${taskId}" not found in project "${projectId}"`,
        );
      }

      return updatedTask;
    } catch (error: any) {
      throw new NotFoundException(
        `Task with ID "${taskId}" not found in project "${projectId}"`,
      );
    }
  }

  @Delete(':taskId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
  ) {
    try {
      const updatedTask = await this.taskService.model.findByIdAndUpdate(
        { _id: taskId, projectId },
        { deleted: true },
        { new: true },
      );
      if (!updatedTask) {
        throw new NotFoundException(
          `Task with ID "${taskId}" not found in project "${projectId}"`,
        );
      }

      return updatedTask;
    } catch (error: any) {
      throw new NotFoundException(
        `Task with ID "${taskId}" not found in project "${projectId}"`,
      );
    }
  }
}
