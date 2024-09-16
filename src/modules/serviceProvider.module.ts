import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceProvider } from 'src/entities/service_provider.entity';
import { ServiceProviderService } from 'src/services/service_provider.service';
import { ServiceProviderController } from 'src/controllers/service_provider.controller';
import { Customer } from 'src/entities/customer.entity';
import { User } from 'src/entities/user.entity';
import { ElasticsearchModule } from './elasticsearch.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceProvider, Customer, User]),
    ElasticsearchModule, // Add ElasticsearchModule to imports
  ],
  providers: [ServiceProviderService],
  controllers: [ServiceProviderController],
  exports: [ServiceProviderService],
})
export class ServiceProviderModule {}
