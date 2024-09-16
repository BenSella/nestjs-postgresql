import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from 'src/entities/customer.entity';
import { CustomerService } from 'src/services/customer.service';
import { CustomerController } from 'src/controllers/customer.controller';
import { User } from 'src/entities/user.entity';
import { UserModule } from 'src/modules/user.module';
import { ElasticsearchModule } from './elasticsearch.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, User]),
    UserModule,
    ElasticsearchModule // Add ElasticsearchModule here
  ],
  providers: [CustomerService],
  controllers: [CustomerController],
  exports: [CustomerService],
})
export class CustomerModule {}
