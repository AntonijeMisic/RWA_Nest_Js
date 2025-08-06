import {
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryColumn
} from 'typeorm';
import { User } from '../users/user.entity';
import { Notification } from './notification.entity';

@Entity('NotificationUser')
export class NotificationUser {
  @PrimaryColumn()
  notificationId: number;

  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => Notification)
  @JoinColumn({ name: 'notificationId' })
  notification: Notification;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}
