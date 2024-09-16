import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from 'src/entities/location.entity';
import { LocationService } from 'src/services/location.service';
import { LocationController } from 'src/controllers/location.controller';
import { UserModule } from 'src/modules/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Location]),
    forwardRef(() => UserModule),
  ],
  providers: [LocationService],
  controllers: [LocationController],
  exports: [TypeOrmModule, LocationService],
})
export class LocationModule {}
