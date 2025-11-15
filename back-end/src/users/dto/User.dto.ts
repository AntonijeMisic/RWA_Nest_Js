import {
  IsEmail,
  IsOptional,
  IsString,
  IsInt,
  IsDateString,
} from 'class-validator';
export class UserDto {
  @IsOptional()
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsInt()
  userRoleId?: number;

  @IsOptional()
  @IsInt()
  userPositionId?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string | null;
}
