import { Module } from '@nestjs/common';
import { ElasticsearchService } from 'src/elasticsearch/elasticsearch.service';
import { ConfigModule } from '@nestjs/config';
import { TimeModule } from './time.module';

@Module({
  imports: [TimeModule,ConfigModule],
  providers: [ElasticsearchService],
  exports: [ElasticsearchService],
})
export class ElasticsearchModule {}