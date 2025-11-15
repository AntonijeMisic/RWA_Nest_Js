import { ConfigService } from '@nestjs/config';
import { Announcement } from 'src/announcements/announcement.entity';
import { RefreshToken } from 'src/auth/refreshToken/refreshToken.entity';
import { FitPassUsage } from 'src/fitpass-usage/fitpassUsage.entity';
import { LeaveRequest } from 'src/leave-requests/leaveRequest.entity';
import { LeaveType } from 'src/lookups/entities/leaveType.entity';
import { RequestStatus } from 'src/lookups/entities/requestStatus.entity';
import { UserPosition } from 'src/lookups/entities/userPosition.entity';
import { UserRole } from 'src/lookups/entities/userRole.entity';
import { WorkType } from 'src/lookups/entities/workType.entity';
import { Notification } from 'src/notifications/notification.entity';
import { NotificationUser } from 'src/notifications/notificationUser.entity';
import { User } from 'src/users/user.entity';
import { WorkLog } from 'src/worklogs/worklog.entity';
import { DataSource } from 'typeorm';

const entities = [
  User,
  UserRole,
  LeaveRequest,
  Announcement,
  FitPassUsage,
  Notification,
  NotificationUser,
  RequestStatus,
  WorkLog,
  UserPosition,
  LeaveType,
  RefreshToken,
  WorkType,
];

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'mssql',
        host: configService.get<string>('DB_HOST'),
        port: Number(configService.get<number>('DB_PORT')),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        options: {
          encrypt: false,
        },
        entities: entities,
        synchronize: false,
      });

      return dataSource.initialize();
    },
  },
];
