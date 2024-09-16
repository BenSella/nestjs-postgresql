import { ExceptionFilter, Catch, ArgumentsHost, HttpException, InternalServerErrorException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ElasticsearchService } from 'src/elasticsearch/elasticsearch.service';
import { ErrorLog } from 'src/entities/error_log.entity';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    @InjectRepository(ErrorLog)
    private readonly errorLogRepository: Repository<ErrorLog>,
  ) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception instanceof HttpException ? exception.getStatus() : 500;

    // Ensure that we capture the full exception and log it
    const message = exception instanceof HttpException 
        ? exception.getResponse()
        : {
            name: (exception as any)?.name || 'UnknownException',
            message: (exception as any)?.message || 'No message available',
            stack: (exception as any)?.stack || 'No stack trace',
        };

    // Log a detailed error message
    this.logger.error(`Status ${status} Error: ${JSON.stringify(message)}`);
    this.logger.error(`Caught an exception: ${JSON.stringify(exception)}`);
    // Store the error in the database
    const errorLog = this.errorLogRepository.create({
      statusCode: status,
      path: request.url,
      message: JSON.stringify(message),
      timestamp: new Date().toISOString(),
    });
    await this.errorLogRepository.save(errorLog);
    
    if (status === 500) {
      // Log the error to Elasticsearch for debugging purposes, even for 500 errors
      this.logger.log(`Logging 500 error to Elasticsearch`);
      this.logger.error(`Caught an exception: ${JSON.stringify(exception)}`);
      await this.elasticsearchService.logException({
        statusCode: status,
        path: request.url,
        message: JSON.stringify(message),
        timestamp: new Date().toISOString(),
      });
    } else {
      this.logger.log('Preparing to log the following error to Elasticsearch:');
      this.logger.error(`Caught an exception: ${JSON.stringify(exception)}`);
      this.logger.log({
        statusCode: status,
        path: request.url,
        message: JSON.stringify(message),
        timestamp: new Date().toISOString(),
      });

      // await this.elasticsearchService.logException({
      //   index: 'business_logs',  // Hard-code for debugging
      //   statusCode: status,
      //   path: request.url,
      //   message: JSON.stringify(message),
      //   timestamp: new Date().toISOString(),
      // });

      await this.elasticsearchService.logException({
        statusCode: status,
        path: request.url,
        message: JSON.stringify(message),
        timestamp: new Date().toISOString(),
      });
    }
    // if (status === 500 || exception instanceof InternalServerErrorException) {
    //   this.logger.warn(`Skipping Elasticsearch indexing due to error status: ${status}`);
    // } else {
    //   // Attempt to log exception to Elasticsearch
    //   this.logger.log('Attempting to log exception to Elasticsearch');
    //   try {
    //     await this.elasticsearchService.logException({
    //       statusCode: status,
    //       path: request.url,
    //       message: JSON.stringify(message),
    //       timestamp: new Date().toISOString(),
    //     });
    //   } catch (error) {
    //     this.logger.error('Error logging exception to Elasticsearch', error); // Log Elasticsearch failure
    //   }
    // }

    // Send detailed error response
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
