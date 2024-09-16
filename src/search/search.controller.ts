import { Controller, Get, Post, Put, Delete, Param, Body, Query, BadRequestException } from '@nestjs/common';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';
import { CreateLocationDto } from 'src/dto/location.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  @Post('index')
  async create(@Body() createLocationDto: CreateLocationDto) {
    const id = Math.random().toString(36).substring(7);
    return this.elasticsearchService.index(id, createLocationDto);
  }

  @Get('query')
    async query(@Query('q') query: string, @Query('lat') lat?: number, @Query('lon') lon?: number, @Query('distance') distance?: string) {
    console.log('Received query:', query);
    if (!query) {
        throw new BadRequestException('Query string is missing');
    }
    return this.elasticsearchService.search(query, lat, lon, distance);
    }

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() updateDoctorDto: CreateLocationDto) {
    return this.elasticsearchService.update(id, updateDoctorDto);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return this.elasticsearchService.delete(id);
  }
}
