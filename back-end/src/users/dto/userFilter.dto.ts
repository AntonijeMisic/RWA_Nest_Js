import { IsOptional, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class UserFilterDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  userRoleId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  userPositionId?: number;
}