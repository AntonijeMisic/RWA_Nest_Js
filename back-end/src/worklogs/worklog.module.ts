import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { workLogProviders } from './worklog.providers';
import { WorkLogController } from './worklogs.controller';
import { WorkLogService } from './worklogs.service';
import { LookupsService } from 'src/lookups/lookups.service';
import { LookupsModule } from 'src/lookups/lookups.module';

@Module({
  imports: [DatabaseModule, LookupsModule],
  controllers: [WorkLogController],
  providers: [...workLogProviders, WorkLogService],
  exports: [...workLogProviders, WorkLogService],
})
export class WorkLogModule {}