import { DataSource } from 'typeorm';
import { WorkLog } from './worklog.entity';

export const workLogProviders = [
  {
    provide: 'WORKLOG_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(WorkLog),
    inject: ['DATA_SOURCE'],
  },
];