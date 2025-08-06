import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { User } from 'src/users/user.entity';

@Entity('Announcement')
export class Announcement {
  @PrimaryGeneratedColumn()
  announcementId: number;

  @Column({ length: 200 })
  title: string;

  @Column('nvarchar')
  message: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @Column({ type: 'datetime', nullable: true })
  visible_until: Date | null;
}