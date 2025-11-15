import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('LeaveType')
export class LeaveType {
  @PrimaryGeneratedColumn()
  leaveTypeId: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  leaveTypeName: string;
}