import { TaskStatus } from '@/models/task-status.enum';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  assigneeId?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;
}
