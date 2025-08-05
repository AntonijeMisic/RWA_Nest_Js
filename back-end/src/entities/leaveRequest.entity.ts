import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { LeaveType } from './leaveType.entity';
import { RequestStatus } from './requestStatus.entity';
import { User } from './user.entity';

@Entity()
export class LeaveRequest {
  @PrimaryGeneratedColumn()
  requestId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => LeaveType)
  @JoinColumn({ name: 'leaveTypeId' })
  leaveType: LeaveType;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @ManyToOne(() => RequestStatus)
  @JoinColumn({ name: 'requestStatusId' })
  requestStatus: RequestStatus;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'approverId' })
  approver: User | null;

  @Column({ type: 'datetime', default: () => 'GETDATE()' })
  requestDate: Date;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  note: string | null;
}