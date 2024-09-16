import { Body, Controller, Post } from '@nestjs/common';
import { ElasticsearchService } from 'src/elasticsearch/elasticsearch.service';
import { InternalServerErrorException } from '@nestjs/common';

@Controller('search')
export class SearchController {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  @Post()
  async search(@Body('query') query: string) {
    return this.elasticsearchService.searchEntities(query);
  }
//   @Post()
//   async search(@Body() body: { query: string }) {
//     try {
//       const { query } = body;
//       const results = await this.elasticsearchService.searchEntities(query);
//       return results;
//     } catch (error) {
//       throw new InternalServerErrorException({
//         message: 'Search failed',
//         error: error || 'Internal Server Error',
//       });
//     }
//   }
}
