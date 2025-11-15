import { DataSource } from 'typeorm';
import { LeaveRequest } from './leaveRequest.entity';

export const leaveRequestsProviders = [
  {
    provide: 'LEAVE_REQUEST_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(LeaveRequest),
    inject: ['DATA_SOURCE'],
  },
];