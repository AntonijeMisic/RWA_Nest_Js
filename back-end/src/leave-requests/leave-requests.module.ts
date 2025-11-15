import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { leaveRequestsProviders } from './leave-requests.providers';
import { LeaveRequestService } from './leave-requests.service';
import { LeaveRequestController } from './leave-requests.controller';
import { LookupsModule } from 'src/lookups/lookups.module';
import { UserModule } from 'src/users/users.module';

@Module({
  imports: [DatabaseModule, LookupsModule, UserModule],
  controllers: [LeaveRequestController],
  providers: [...leaveRequestsProviders, LeaveRequestService],
  exports: [...leaveRequestsProviders, LeaveRequestService],
})
export class LeaveRequestModule {}