import { Controller, Post, Body, Get, Query, Param, UseGuards } from '@nestjs/common';
import { WorkLogService } from './worklogs.service';
import { WorkLog } from './worklog.entity';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';

@Controller('worklog')
@UseGuards(JwtAuthGuard)
export class WorkLogController {
  constructor(private readonly workLogService: WorkLogService) {}

  @Post('clock-in')
  async clockIn(@Body() body: { userId: number; workTypeId?: number }) {
    return this.workLogService.clockIn(body.userId, body.workTypeId);
  }

  @Post('start-break')
  async startBreak(@Body() body: { userId: number }) {
    return this.workLogService.startBreak(body.userId);
  }

  @Post('resume-work')
  async resumeWork(@Body() body: { userId: number }) {
    return this.workLogService.resumeWork(body.userId);
  }

  @Post('clock-out')
  async clockOut(@Body() body: { userId: number }) {
    return this.workLogService.clockOut(body.userId);
  }

  @Get('my-logs')
  async getMyLogs(@Query('userId') userId: number) {
    return this.workLogService.getWorkLogsForUser(userId);
  }

  @Get('current-week')
  async getCurrentWeekLogs(@Query('userId') userId: number) {
    return this.workLogService.getWorkLogsForCurrentWeek(userId);
  }

  @Get('user/:userId/date/:date')
  async getLogForDate(
    @Param('userId') userId: number,
    @Param('date') date: string,
  ): Promise<WorkLog | null> {
    return this.workLogService.getWorkLogForDate(userId, date);
  }
}