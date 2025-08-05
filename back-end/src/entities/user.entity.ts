import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserRole } from './userRole.entity';
import { UserPosition } from './userPosition.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ type: 'nvarchar', nullable: false })
  firstName: string;

  @Column({ type: 'nvarchar', nullable: false })
  lastName: string;

  @Column({ type: 'nvarchar', unique: true, nullable: false })
  email: string;

  @Column({ length: 255, nullable: false })
  password: string;

  @ManyToOne(() => UserRole)
  @JoinColumn({ name: 'userRoleId' })
  userRole: UserRole;

  @ManyToOne(() => UserPosition)
  @JoinColumn({ name: 'userPositionId' })
  userPosition: UserPosition;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date | null; //ne znam zasto je nullable??
}