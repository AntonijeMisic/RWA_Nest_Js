import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository, Between } from 'typeorm';
import { WorkLog } from './worklog.entity';
import { startOfWeek, addDays } from 'date-fns';
import { LookupsService } from 'src/lookups/lookups.service';
import { WorkType } from 'src/lookups/entities/workType.entity';

@Injectable()
export class WorkLogService {
  constructor(
    @Inject('WORKLOG_REPOSITORY')
    private workLogRepo: Repository<WorkLog>,
    private lookupService: LookupsService,
  ) {}

  async clockIn(userId: number, workTypeId?: number): Promise<WorkLog> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingLog = await this.workLogRepo.findOne({
      where: { userId, workDate: today },
    });

    if (existingLog) {
      throw new BadRequestException('Already clocked in today');
    }

    let workType: WorkType | undefined = undefined;

    if (workTypeId) {
      const wt = await this.lookupService.getWorkTypeById(workTypeId);
      if (!wt) {
        throw new BadRequestException('Invalid work type');
      }
      workType = wt;
    }

    const workLogData: Partial<WorkLog> = {
      userId,
      workDate: today,
      clockIn: new Date(),
      breakMinutes: 0,
    };

    if (workType) {
      workLogData.workTypeId = workType.workTypeId;
      workLogData.workType = workType;
    }

    const workLog = this.workLogRepo.create(workLogData);
    return this.workLogRepo.save(workLog);
  }

  async startBreak(userId: number): Promise<WorkLog> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const workLog = await this.workLogRepo.findOne({
      where: { userId, workDate: today },
    });

    if (!workLog) throw new NotFoundException('No active work log for today');
    if (workLog.startBreakTime) return workLog;

    workLog.startBreakTime = new Date();
    return this.workLogRepo.save(workLog);
  }

  async resumeWork(userId: number): Promise<WorkLog> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const workLog = await this.workLogRepo.findOne({
      where: { userId, workDate: today },
    });

    if (!workLog) throw new NotFoundException('No active work log for today');

    if (!workLog.startBreakTime) return workLog;

    const now = new Date();
    const diffMinutes = Math.floor(
      (now.getTime() - new Date(workLog.startBreakTime).getTime()) / 1000 / 60,
    );

    workLog.breakMinutes = (workLog.breakMinutes || 0) + diffMinutes;

    return this.workLogRepo.save(workLog);
  }

  async clockOut(userId: number): Promise<WorkLog> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const workLog = await this.workLogRepo.findOne({
      where: { userId, workDate: today },
    });

    if (!workLog) {
      throw new NotFoundException('No active work log for today');
    }

    if (workLog.clockOut) {
      throw new BadRequestException('Already clocked out today');
    }

    workLog.clockOut = new Date();

    const diffMinutes =
      (workLog.clockOut.getTime() - workLog.clockIn.getTime()) / 1000 / 60;
    workLog.totalHours = (diffMinutes - workLog.breakMinutes) / 60;

    return this.workLogRepo.save(workLog);
  }

  async getWorkLogsForUser(userId: number): Promise<WorkLog[]> {
    return this.workLogRepo.find({
      where: { userId },
      order: { workDate: 'DESC' },
    });
  }

  async getWorkLogsForCurrentWeek(userId: number): Promise<WorkLog[]> {
    const today = new Date();

    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = addDays(weekStart, 6);

    const logs = await this.workLogRepo.find({
      where: {
        userId,
        workDate: Between(weekStart, weekEnd),
      },
      order: { workDate: 'ASC' },
    });

    return logs;
  }

  async getWorkLogsForWeek(
    userId: number,
    referenceDate: Date,
  ): Promise<WorkLog[]> {
    const weekStart = startOfWeek(referenceDate, { weekStartsOn: 1 });
    const weekEnd = addDays(weekStart, 6);

    return this.workLogRepo.find({
      where: { userId, workDate: Between(weekStart, weekEnd) },
      order: { workDate: 'ASC' },
    });
  }

  async getWorkLogForDate(
    userId: number,
    date: string,
  ): Promise<WorkLog | null> {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    return this.workLogRepo.findOne({
      where: {
        userId,
        workDate: Between(start, end),
      },
      relations: ['workType'],
    });
  }
}