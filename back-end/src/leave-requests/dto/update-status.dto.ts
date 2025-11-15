import { IsInt } from 'class-validator';

export class UpdateStatusDto {
  @IsInt()
  requestId: number;

  @IsInt()
  approverId: number;

  @IsInt()
  statusId: number;
}
