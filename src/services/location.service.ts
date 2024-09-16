import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from 'src/entities/location.entity';
import { CreateLocationDto } from 'src/dto/location.dto';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async createLocation(createLocationDto: CreateLocationDto): Promise<Location> {
    const location = this.locationRepository.create(createLocationDto);
    return this.locationRepository.save(location);
  }

  async findAll(): Promise<Location[]> {
    return this.locationRepository.find();
  }

  async findOne(id: number): Promise<Location> {
    return this.locationRepository.findOne({ where: { id } });
  }

  async updateLocation(id: number, createLocationDto: CreateLocationDto): Promise<Location> {
    await this.locationRepository.update(id, createLocationDto);
    return this.locationRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.locationRepository.delete(id);
  }
}
