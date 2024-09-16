import { IsString, IsDateString, IsEnum, IsOptional, IsArray, IsISO8601, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './user.dto';

enum MeetingType {
  PHONE = 'phone',
  VIDEO = 'video',
  PHYSICAL = 'physical',
}

export class CreateAppointmentDto  {
  @ApiProperty()
  @IsDateString()
  appointmentDate: Date;

  @ApiProperty({ description: 'Appointment time in HH:mm:ss format' })
  @IsString()
  appointmentTime: string;

  @ApiProperty()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @IsNumber()
  serviceProviderId: number;

  @ApiProperty()
  @IsNumber()
  customerId: number;

  @ApiProperty({ enum: MeetingType })
  @IsEnum(MeetingType)
  meetingType: MeetingType;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  videoLink?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  physicalLocation?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  doctorNotes?: string;
}