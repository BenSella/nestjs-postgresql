import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { LocationService } from 'src/services/location.service';
import { CreateLocationDto } from 'src/dto/location.dto';
import { Location } from 'src/entities/location.entity';

@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  async create(@Body() createLocationDto: CreateLocationDto): Promise<Location> {
    // Corrected method name
    return this.locationService.createLocation(createLocationDto);
  }

  @Get()
  async findAll(): Promise<Location[]> {
    return this.locationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Location> {
    return this.locationService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() createLocationDto: CreateLocationDto): Promise<Location> {
    return this.locationService.updateLocation(id, createLocationDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.locationService.remove(id);
  }
}
