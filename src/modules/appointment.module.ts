import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentService } from '../services/appointment.service';
import { Appointment } from '../entities/appointment.entity';
import { User } from '../entities/user.entity';
import { ServiceProvider } from '../entities/service_provider.entity';
import { Customer } from '../entities/customer.entity';
import { AppointmentController } from '../controllers/appointment.controller';
import { UserModule } from './user.module';
import { ServiceProviderModule } from './serviceProvider.module';
import { ElasticsearchModule } from './elasticsearch.module';  // Import ElasticsearchModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, User, ServiceProvider, Customer]),
    forwardRef(() => UserModule),
    forwardRef(() => ServiceProviderModule),  // Import ServiceProviderModule if you have it
    ElasticsearchModule,  // Import the ElasticsearchModule
  ],
  providers: [AppointmentService],
  controllers: [AppointmentController],
  exports: [AppointmentService],
})
export class AppointmentModule {}