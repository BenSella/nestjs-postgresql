import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UsersService } from 'src/services/users.service';
import { UsersController } from 'src/controllers/users.controller';
import { LocationModule } from 'src/modules/location.module';
import { ElasticsearchModule } from '../modules/elasticsearch.module'; 
 
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => LocationModule),
    ElasticsearchModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})

export class UserModule {}
