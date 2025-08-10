import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseDto } from '@/models/base.model';
import { EnumToArray } from '@/shared/utils/enum-to-array';
import { Gender } from '@/models/gender.enum';

export class UserDto extends BaseDto {
  @ApiProperty() email: string;
  @ApiProperty() username: string;
  @ApiPropertyOptional() fristName?: string;
  @ApiPropertyOptional() lastName?: string;
  @ApiPropertyOptional() deviceId?: string;
  @ApiPropertyOptional() socialLogin: boolean;
  @ApiPropertyOptional() socialId?: string;
  @ApiPropertyOptional() birthDate?: Date;
  @ApiPropertyOptional({ enum: EnumToArray(Gender) }) gender?: Gender;
}
