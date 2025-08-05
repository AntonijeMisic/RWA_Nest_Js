import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity()
export class RequestStatus {
  @PrimaryGeneratedColumn()
  requestStatusId: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  requestStatusName: string;
}