import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './filters/all_exceptions_filter';
import { ElasticsearchService } from './elasticsearch/elasticsearch.service';
import { ErrorLog } from './entities/error_log.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get the services and repositories needed for the filter
  const elasticsearchService = app.get(ElasticsearchService);
  
  const errorLogRepository = app.get<Repository<ErrorLog>>(getRepositoryToken(ErrorLog));
  // Register the filter manually
  app.useGlobalFilters(new AllExceptionsFilter(elasticsearchService, errorLogRepository));

  // Set up Swagger
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap();
