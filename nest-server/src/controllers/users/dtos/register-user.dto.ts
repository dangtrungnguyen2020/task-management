import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ReqLoginDto } from '../../auth/dtos/req-login.dto';
import { Gender } from '@/models/gender.enum';
import { EnumToArray } from '@/shared/utils/enum-to-array';

export class RegisterUserDto extends ReqLoginDto {
  @ApiProperty() firstName?: string;

  @ApiProperty() lastName?: string;

  @ApiProperty()
  @Type(() => Date)
  birthDate?: Date;

  @ApiProperty({ enum: EnumToArray(Gender) })
  @IsEnum(Gender)
  @Transform(({ value }) => Gender[value], { toClassOnly: true })
  gender?: Gender;
}
