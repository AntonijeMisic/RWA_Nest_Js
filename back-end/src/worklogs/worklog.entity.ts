import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('WorkLog')
export class WorkLog {
  @PrimaryGeneratedColumn()
  worklogId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'datetime' })
  clockIn: Date;

  @Column({ type: 'datetime', nullable: true })
  clockOut: Date | null;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  note: string | null;
}