import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchService } from './elasticsearch/elasticsearch.service';
import { UserModule } from './modules/user.module';
import { LocationModule } from './modules/location.module';
import { ServiceProviderModule } from './modules/serviceProvider.module';
import { CustomerModule } from './modules/customer.module';
import { TestController } from 'src/controllers/technical.logs.controller'; 
import { AppointmentModule } from './modules/appointment.module';
import { AllExceptionsFilter } from './filters/all_exceptions_filter';
import { ErrorLog } from './entities/error_log.entity';
import { User } from './entities/user.entity'; 
import { Location } from './entities/location.entity';
import { ServiceProvider } from './entities/service_provider.entity';
import { Customer } from './entities/customer.entity';
import { Appointment } from './entities/appointment.entity';
import configuration from './configuration/configuration';
import { TimeService } from 'src/services/time.service';
import { TimeModule } from 'src/modules/time.module'; 
import { SearchController } from './controllers/elasticsearch.controller';

@Module({
  imports: [
    TimeModule,
    ConfigModule.forRoot({isGlobal: true, load: [configuration], }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        entities: [ErrorLog, User, Location, ServiceProvider, Customer, Appointment], 
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([ErrorLog]), 
    UserModule,
    LocationModule,
    ServiceProviderModule,
    CustomerModule,
    AppointmentModule,
  ],
  providers: [
    ElasticsearchService,
    TimeService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
  controllers: [TestController, SearchController], 
})
export class AppModule {}
