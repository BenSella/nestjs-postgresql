import { Controller, Get, Post, Put, Delete, Param, Body, BadRequestException } from '@nestjs/common';
import { AppointmentService } from 'src/services/appointment.service';
import { CreateAppointmentDto } from 'src/dto/appointment.dto';
import { Appointment } from 'src/entities/appointment.entity';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get()
  findAll(): Promise<Appointment[]> {
    return this.appointmentService.findAll();
  }

 
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.appointmentService.findOne(id);
  }

  @Post()
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.create(createAppointmentDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    return this.appointmentService.update(+id, updateAppointmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.appointmentService.remove(+id);
  }
}
