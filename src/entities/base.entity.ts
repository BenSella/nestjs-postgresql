import { BaseEntity as TypeOrmBaseEntity, PrimaryGeneratedColumn } from 'typeorm';

export abstract class BaseEntity {
    id: number;
  }