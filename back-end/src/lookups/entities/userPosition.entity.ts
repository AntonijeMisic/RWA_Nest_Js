import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('UserPosition')
export class UserPosition {
  @PrimaryGeneratedColumn()
  userPositionId: number;

  @Column({ type: 'nvarchar', length: 100, unique: true })
  userPositionName: string;
}
