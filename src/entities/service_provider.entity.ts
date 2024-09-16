import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, BaseEntity } from 'typeorm';
import { User } from './user.entity';

@Entity('service_providers')
export class ServiceProvider extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  serviceType: string;

  @ManyToOne(() => User, (user) => user.serviceProviders, { onDelete: 'CASCADE' }) // Cascade only on this side
  user: User;
}
