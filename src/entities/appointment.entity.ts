import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { User } from './user.entity';
import { ServiceProvider } from './service_provider.entity';
import { Customer } from './customer.entity';

export enum MeetingType {
  PHONE = 'phone',
  VIDEO = 'video',
  PHYSICAL = 'physical',
}

@Entity('appointments')
export class Appointment extends BaseEntity { 
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'appointment_date', type: 'timestamp', nullable: false })
  appointmentDate: Date;

  @Column({ name: 'appointment_time', type: 'time', nullable: true, default: '00:00:00' })
  appointmentTime: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => ServiceProvider)
  @JoinColumn({ name: 'service_provider_id' })
  serviceProvider: ServiceProvider;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ name: 'meeting_type', type: 'enum', enum: MeetingType })
  meetingType: MeetingType;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber?: string;

  @Column({ name: 'video_link', nullable: true })
  videoLink?: string;

  @Column({ name: 'physical_location', nullable: true })
  physicalLocation?: string;

  @Column({ name: 'doctor_notes', nullable: true })
  doctorNotes?: string;
}
