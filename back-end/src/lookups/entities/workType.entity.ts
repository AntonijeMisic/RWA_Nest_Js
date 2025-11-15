import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('WorkType')
export class WorkType {
  @PrimaryGeneratedColumn()
  workTypeId: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  workTypeName: string;
}