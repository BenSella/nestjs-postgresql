import { Entity, Column, PrimaryGeneratedColumn , BaseEntity } from 'typeorm';

@Entity('error_logs')
export class ErrorLog extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  statusCode: number;

  @Column()
  path: string;

  @Column('text')
  message: string;

  @Column()
  timestamp: string;
}
