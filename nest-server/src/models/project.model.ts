import { prop, getModelForClass } from '@typegoose/typegoose';
import { BaseModel, schemaOptions } from './base.model';

export class Project extends BaseModel {
  @prop()
  title: string;

  @prop()
  description?: string;

  @prop()
  ownerId: string;

  @prop({ type: () => [String], default: [], index: true })
  members?: string[];

  @prop()
  deleted: boolean;

  static get model() {
    return getModelForClass(Project, { schemaOptions });
  }

  static get modelName(): string {
    return this.model.modelName;
  }
}

export const ClientModel = Project.model;
