import { Task } from '@/models/task.model';
import { BaseService } from '@/shared/base.service';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export default class TaskService extends BaseService<Task> {
  private readonly logger = new Logger('ProjectService');

  constructor(
    @InjectModel(Task.modelName)
    private readonly userModel: ReturnModelType<typeof Task>,
  ) {
    super();
    this._model = userModel;
  }

  get model() {
    return this._model;
  }
}
