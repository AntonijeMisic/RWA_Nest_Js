import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity('UserRole')
export class UserRole {
  @PrimaryGeneratedColumn()
  userRoleId: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  roleName: string;
}