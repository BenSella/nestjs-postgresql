import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { ServiceProvider } from 'src/entities/service_provider.entity';
import { ElasticsearchService } from 'src/elasticsearch/elasticsearch.service';
import { BaseService } from 'src/services/base.service';
import { CreateServiceProviderDto } from 'src/dto/service_provider.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class ServiceProviderService extends BaseService<ServiceProvider> {
  constructor(
    @InjectRepository(ServiceProvider)
    repository: Repository<ServiceProvider>,
    elasticsearchService: ElasticsearchService,
  ) {
    super(repository, elasticsearchService);
  }

  async findOne(id: number): Promise<ServiceProvider> {
    const serviceProvider = await this.repository.findOne({ where: { id }, relations: ['user'] });
  
    if (!serviceProvider) {
      throw new NotFoundException(`Service Provider with ID ${id} not found`);
    }
  
    return serviceProvider;
  }
  async findAll(): Promise<ServiceProvider[]> {
    return this.repository.find({ relations: ['user'] });
  }

  async createServiceProvider(createServiceProviderDto: CreateServiceProviderDto, manager: EntityManager): Promise<ServiceProvider> {
    const serviceProvider = new ServiceProvider();
    serviceProvider.serviceType = createServiceProviderDto.serviceType;
    serviceProvider.user = await manager.findOne(User, { where: { id: createServiceProviderDto.userId } });
  
    if (!serviceProvider.user) {
      throw new NotFoundException(`User with ID ${createServiceProviderDto.userId} not found`);
    }
  
    // Save the serviceProvider to get the generated ID
    const savedServiceProvider = await this.repository.save(serviceProvider);
  
    // Now you can safely use the generated ID
    await this.create(savedServiceProvider, savedServiceProvider.id.toString(), manager);
  
    return savedServiceProvider;
  }

  async updateServiceProvider(id: number, updateServiceProviderDto: Partial<CreateServiceProviderDto>, manager: EntityManager): Promise<ServiceProvider> {
    return await manager.transaction(async transactionalEntityManager => {
      const serviceProvider = await transactionalEntityManager.findOne(ServiceProvider, { where: { id } });

      if (!serviceProvider) {
        throw new NotFoundException(`Service Provider with ID ${id} not found`);
      }

      if (updateServiceProviderDto.userId) {
        const user = await transactionalEntityManager.findOne(User, { where: { id: updateServiceProviderDto.userId } });
        if (!user) {
          throw new NotFoundException(`User with ID ${updateServiceProviderDto.userId} not found`);
        }
        serviceProvider.user = user;
      }

      if (updateServiceProviderDto.serviceType) {
        serviceProvider.serviceType = updateServiceProviderDto.serviceType;
      }

      const updatedServiceProvider = await transactionalEntityManager.save(serviceProvider);

      try {
        await this.elasticsearchService.update(updatedServiceProvider.id.toString(), updatedServiceProvider);
      } catch (error) {
        throw new InternalServerErrorException('Failed to update service provider in Elasticsearch');
      }

      return updatedServiceProvider;
    });
  }

  async deleteServiceProvider(id: number, manager: EntityManager): Promise<void> {
    return await manager.transaction(async transactionalEntityManager => {
      const serviceProvider = await transactionalEntityManager.findOne(ServiceProvider, { where: { id } });
  
      if (!serviceProvider) {
        throw new NotFoundException(`Service Provider with ID ${id} not found`);
      }
  
      await transactionalEntityManager.delete(ServiceProvider, id);
  
      try {
        await this.elasticsearchService.delete(id.toString());
      } catch (error) {
        throw new InternalServerErrorException('Failed to delete service provider from Elasticsearch');
      }
    });
  }
}
