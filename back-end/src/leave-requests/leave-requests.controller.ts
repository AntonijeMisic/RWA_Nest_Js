import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { LeaveRequestService } from './leave-requests.service';
import { LeaveRequest } from './leaveRequest.entity';

@Controller('leave-requests')
export class LeaveRequestController {
  constructor(private readonly service: LeaveRequestService) {}

  @Post()
  create(@Body() dto: CreateLeaveRequestDto) {
    return this.service.createLeaveRequest(dto);
  }

  @Get()
  getAll() {
    return this.service.getAllRequests();
  }

  @Get('user/:userId')
  getByUser(@Param('userId') userId: number) {
    return this.service.getRequestsByUser(userId);
  }

  @Get('user/:userId/week')
  async getLeaveRequestsForWeek(
    @Param('userId') userId: number,
    @Query('start') weekStart: string,
    @Query('end') weekEnd: string,
  ): Promise<LeaveRequest[]> {
    return this.service.getApprovedLeavesForUserInPeriod(
      userId,
      weekStart,
      weekEnd,
    );
  }

  @Patch('status')
  updateStatus(@Body() dto: UpdateStatusDto) {
    return this.service.updateRequestStatus(
      dto.requestId,
      dto.approverId,
      dto.statusId,
    );
  }

  @Delete(':requestId/:userId')
  deleteRequest(
    @Param('requestId') requestId: number,
    @Param('userId') userId: number,
  ) {
    return this.service.deleteRequest(requestId, userId);
  }
}