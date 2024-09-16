import { IsString, IsEmail, IsNumber, IsEnum, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateLocationDto } from './location.dto';

enum UserType {
  DOCTOR = 'doctor',
  CUSTOMER = 'customer',
  OTHER = 'other'
}

export class CreateUserDto {
  @ApiProperty()
  @IsNumber()
  userId?: number;

  @ApiProperty()
  @IsNumber()
  age: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty({ enum: UserType })
  @IsEnum(UserType)
  userType: UserType;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ type: CreateLocationDto })
  @ValidateNested()
  @Type(() => CreateLocationDto)
  location: CreateLocationDto;
}