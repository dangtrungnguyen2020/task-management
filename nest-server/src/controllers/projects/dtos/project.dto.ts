import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class ProjectDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  deleted?: boolean;

  @IsString()
  @IsOptional()
  ownerId: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  members?: string[] = [];
}
