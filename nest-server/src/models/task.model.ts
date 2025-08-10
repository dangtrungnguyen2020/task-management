import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { BaseModel, schemaOptions } from './base.model';
import { TaskStatus } from './task-status.enum';
import { Project } from './project.model';

export class Task extends BaseModel {
  @prop()
  title: string;

  @prop()
  description?: string;

  @prop({ required: true, enum: TaskStatus, default: TaskStatus.TODO })
  status: TaskStatus;

  @prop({ required: true, ref: () => Project })
  projectId: Ref<Project>;

  @prop({ type: () => String, required: true })
  assigneeId: string;

  @prop()
  deleted: boolean;

  static get model() {
    return getModelForClass(Task, { schemaOptions });
  }

  static get modelName(): string {
    return this.model.modelName;
  }
}

export const ClientModel = Task.model;
