import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { UserPosition } from "../lookups/entities/userPosition.entity";
import { UserRole } from "../lookups/entities/userRole.entity";

@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ type: 'nvarchar', nullable: false })
  firstName: string;

  @Column({ type: 'nvarchar', nullable: false })
  lastName: string;

  @Column({ type: 'nvarchar', unique: true, nullable: false })
  email: string;

  @Column({ length: 255, nullable: false })
  password: string;

  @Column()
  userRoleId: number;

  @ManyToOne(() => UserRole)
  @JoinColumn({ name: 'userRoleId' })
  userRole: UserRole;

  @Column()
  userPositionId: number;

  @ManyToOne(() => UserPosition)
  @JoinColumn({ name: 'userPositionId' })
  userPosition: UserPosition;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date | null;
}
