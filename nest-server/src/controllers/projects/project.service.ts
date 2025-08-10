import { Project } from '@/models/project.model';
import { BaseService } from '@/shared/base.service';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class ProjectService extends BaseService<Project> {
  private readonly logger = new Logger('ProjectService');

  constructor(
    @InjectModel(Project.modelName)
    private readonly userModel: ReturnModelType<typeof Project>,
  ) {
    super();
    this._model = userModel;
  }

  get model() {
    return this._model;
  }
}
