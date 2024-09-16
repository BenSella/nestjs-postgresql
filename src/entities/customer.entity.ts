import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, BaseEntity } from 'typeorm';
import { User } from './user.entity';

@Entity('customers')
export class Customer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phoneNumber: string;

  @ManyToOne(() => User, (user) => user.customers, { onDelete: 'CASCADE' }) // Cascade delete on this side
  user: User;
}

// import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany , BaseEntity} from 'typeorm';
// import { User } from './user.entity';
// import { Appointment } from './appointment.entity';
// import { ServiceProvider } from './service_provider.entity';

// @Entity('customers')
// export class Customer extends BaseEntity {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   phoneNumber: string;

//   @ManyToOne(() => User, (user) => user.customers, { cascade: true })
//   @JoinColumn() // Ensure this is correctly set up
//   user: User;

//   @OneToMany(() => Appointment, (appointment) => appointment.customer)
//   appointments: Appointment[];

//   @OneToMany(() => ServiceProvider, (serviceProvider) => serviceProvider.customer)
//   serviceProviders: ServiceProvider[];
// }
