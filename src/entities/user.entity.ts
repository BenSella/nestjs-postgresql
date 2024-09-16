import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany } from 'typeorm';
import { Location } from './location.entity';
import { Customer } from './customer.entity';
import { ServiceProvider } from './service_provider.entity';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  userId?: number;

  @Column()
  age: number;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column()
  userType: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => Location, (location) => location.user, { cascade: true, onDelete: 'CASCADE' })
  locations: Location[];

  @OneToMany(() => Customer, (customer) => customer.user, { cascade: true, onDelete: 'CASCADE' })
  customers: Customer[];

  @OneToMany(() => ServiceProvider, (serviceProvider) => serviceProvider.user)
  serviceProviders: ServiceProvider[];
}
