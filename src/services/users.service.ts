import { Injectable, ConflictException, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/user.dto';
import { Location } from '../entities/location.entity';
import { ElasticsearchService } from 'src/elasticsearch/elasticsearch.service';
import { BaseService } from 'src/services/base.service';

@Injectable()
export class UsersService extends BaseService<User> {
  protected readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    repository: Repository<User>,
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    elasticsearchService: ElasticsearchService,
  ) {
    super(repository, elasticsearchService);
  }

  async findOne(id: number): Promise<User> {
    const user = await this.repository.findOne({
      where: { id },
      relations: ['locations'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.repository.find({ relations: ['locations'] });
  }

  async createUser(createUserDto: CreateUserDto, manager: EntityManager): Promise<User> {
    const { email, location: locationDto, ...userData } = createUserDto;
  
    // Check if a user with the same email already exists
    const existingUser = await manager.findOne(User, { where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already exists.');
    }
  
    // Create the user entity
    const user = this.repository.create(userData);
    user.email = email;
  
    // Save the user and get the saved entity with the ID
    const savedUser = await manager.save(user);
  
    // Create and save the location associated with the user
    if (locationDto) {
      const location = this.locationRepository.create({
        ...locationDto,
        user: savedUser, // Associate the user with the location
      });
      await manager.save(location);
      savedUser.locations = [location];  // Attach the location to the savedUser object
    }
  
    // Update Elasticsearch with user and locations (without duplicating user data)
    await this.elasticsearchService.index(savedUser.id.toString(), {
      ...savedUser,
      locations: savedUser.locations.map(location => {
        const { user, ...locationData } = location;  // Remove user data from locations to avoid duplication in Elasticsearch
        return locationData;
      }),
    });
  
    // Return the saved user object (with all data) as it is
    return savedUser;
  }
  
  async updateUser(id: number, updateUserDto: CreateUserDto, manager: EntityManager): Promise<User> {
    this.logger.log(`Updating user with ID ${id}`);
    const { email, location: locationDto, ...userData } = updateUserDto;
  
    try {
      const user = await this.repository.findOne({
        where: { id },
        relations: ['locations'], // Load existing locations
      });
  
      if (!user) {
        throw new NotFoundException('User not found.');
      }
  
      // Update user details
      if (email && email !== user.email) {
        const existingUser = await manager.findOne(User, { where: { email } });
        if (existingUser && existingUser.id !== id) {
          throw new ConflictException('Email already exists.');
        }
        user.email = email;
      }
      Object.assign(user, userData);
  
      const updatedUser = await this.update(id, userData as Partial<User>, manager);
  
      // Update or create locations
      if (locationDto) {
        if (user.locations && user.locations.length > 0) {
          // Update existing location
          const location = user.locations[0];
          Object.assign(location, locationDto);
          await manager.save(location);
        } else {
          // Create a new location if it doesn't exist
          const newLocation = this.locationRepository.create({
            ...locationDto,
            user: updatedUser,
          });
          await manager.save(newLocation);
        }
      }
  
      // Update Elasticsearch index with the user entity and locations
      await this.elasticsearchService.index(updatedUser.id.toString(), {
        ...updatedUser,
        locations: updatedUser.locations,  // Ensure locations are included in Elasticsearch
      });
  
      return updatedUser;
    } catch (error) {
      this.logger.error('Failed to update user', error); // Logging the actual error message
      throw new InternalServerErrorException('Failed to update user');
    }
  }
  
  async deleteUser(id: number, manager: EntityManager): Promise<void> {
    return this.remove(id, manager);
  }
}
