import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  readonly email: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly username: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly bio: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly image: string;
}
