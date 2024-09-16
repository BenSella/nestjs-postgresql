import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, BaseEntity } from 'typeorm';
import { User } from './user.entity';

@Entity('locations')
export class Location extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cityName: string;

  @Column()
  cityCode: number;

  @Column()
  streetName: string;

  @Column()
  buildingNumber: number;

  @Column()
  buildingEntarence: string;

  @Column()
  floor: number;

  @Column()
  apartment: number;

  @Column('decimal', { precision: 10, scale: 6 })
  latitude: number;

  @Column('decimal', { precision: 10, scale: 6 })
  longitude: number;

  @ManyToOne(() => User, (user) => user.locations, { onDelete: 'CASCADE' })
  user: User; 
}