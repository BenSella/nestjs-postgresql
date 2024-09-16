import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceProviderDto {

  @ApiProperty()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @IsString()
  serviceType: string;
}
