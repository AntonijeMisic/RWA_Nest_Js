import { Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateLeaveRequestDto {
  @IsInt()
  userId: number;

  @IsInt()
  leaveTypeId: number;

  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @IsOptional()
  @IsString()
  note?: string;
}