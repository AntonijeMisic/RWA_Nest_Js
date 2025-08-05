import {
  Entity,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  notification_id: number;

  @Column({ length: 200 })
  title: string;

  @Column('nvarchar')
  message: string;
}
