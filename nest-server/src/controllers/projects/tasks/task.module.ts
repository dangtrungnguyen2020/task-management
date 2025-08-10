import { Module } from '@nestjs/common';
import TaskController from './task.controller';
import TaskService from './task.service';
import { Task } from '@/models/task.model';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectModule } from '../project.module';
import { ProjectService } from '../project.service';
import { Project } from '@/models/project.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.modelName, schema: Project.model.schema },
      { name: Task.modelName, schema: Task.model.schema },
    ]),
    ProjectModule,
  ],
  controllers: [TaskController],
  providers: [TaskService, ProjectService],
})
export class TasksModule {}
