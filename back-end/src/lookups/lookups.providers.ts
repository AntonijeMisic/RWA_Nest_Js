import { LeaveType } from "src/lookups/entities/leaveType.entity";
import { RequestStatus } from "src/lookups/entities/requestStatus.entity";
import { UserPosition } from "src/lookups/entities/userPosition.entity";
import { UserRole } from "src/lookups/entities/userRole.entity";
import { DataSource } from "typeorm";

export const lookupProviders = [
  {
    provide: 'USER_ROLE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(UserRole),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'USER_POSITION_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(UserPosition),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'LEAVE_TYPE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(LeaveType),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'REQUEST_STATUS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(RequestStatus),
    inject: ['DATA_SOURCE'],
  },
];
