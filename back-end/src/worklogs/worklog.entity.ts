import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { User } from '../users/user.entity';
import { WorkType } from 'src/lookups/entities/workType.entity';

@Entity('WorkLog')
export class WorkLog {
  @PrimaryGeneratedColumn()
  worklogId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @Column({ type: 'date' })
  workDate: Date;

  @Column({ type: 'datetime' })
  clockIn: Date;

  @Column({ type: 'datetime', nullable: true })
  clockOut: Date | null;

  @Column({ type: 'int', name: 'breakMinutes' })
  breakMinutes: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  totalHours: number;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  note: string | null;

  @ManyToOne(() => WorkType, { eager: true })
  @JoinColumn({ name: 'workTypeId' })
  workType: WorkType;

  @Column({ nullable: true })
  workTypeId: number;

  @Column({ type: 'datetime', nullable: true })
  startBreakTime: Date | null;
}