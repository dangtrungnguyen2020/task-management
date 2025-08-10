import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResLoginDto {
  @ApiProperty() accessToken: string;
  @ApiProperty({ default: 'bearer' }) tokenType: string = 'bearer';
  @ApiProperty() expiresIn: number;
  @ApiPropertyOptional() refreshToken?: string;
}
