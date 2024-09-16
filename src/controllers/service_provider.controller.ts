import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ServiceProviderService } from 'src/services/service_provider.service';
import { CreateServiceProviderDto } from 'src/dto/service_provider.dto';
import { ServiceProvider } from 'src/entities/service_provider.entity';
import { EntityManager } from 'typeorm';

@Controller('service-providers')
export class ServiceProviderController {
  constructor(
    private readonly serviceProviderService: ServiceProviderService,
    private readonly entityManager: EntityManager, // Inject EntityManager
  ) {}

  @Get()
  async findAll(): Promise<ServiceProvider[]> {
    return this.entityManager.transaction(async manager => {
      return this.serviceProviderService.findAll();
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ServiceProvider> {
    return this.entityManager.transaction(async manager => {
      return this.serviceProviderService.findOne(+id);
    });
  }

  @Post()
  async create(@Body() createServiceProviderDto: CreateServiceProviderDto): Promise<ServiceProvider> {
    return this.entityManager.transaction(async manager => {
      const serviceProvider = await this.serviceProviderService.createServiceProvider(createServiceProviderDto, manager);
      return this.serviceProviderService.findOne(serviceProvider.id);
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateServiceProviderDto: CreateServiceProviderDto): Promise<ServiceProvider> {
    return this.entityManager.transaction(async manager => {
      return this.serviceProviderService.updateServiceProvider(+id, updateServiceProviderDto, manager);
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.entityManager.transaction(async manager => {
      return this.serviceProviderService.deleteServiceProvider(+id, manager);
    });
  }
}
