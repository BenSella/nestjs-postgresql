import { Injectable, OnModuleInit, Logger, InternalServerErrorException } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { ConfigService } from '@nestjs/config';
import { TimeService } from 'src/services/time.service'; 

@Injectable()
export class ElasticsearchService implements OnModuleInit {
  private readonly logger = new Logger(ElasticsearchService.name);
  private readonly client: Client;

  constructor(private readonly configService: ConfigService, private readonly timeService: TimeService) {
    const nodeUrl = this.configService.get<string>('elastic.node');
    if (!nodeUrl || nodeUrl === 'default_node_url') {
      throw new Error('Elasticsearch node URL is not defined in the configuration.');
    }

    this.client = new Client({
      node: nodeUrl,
      auth: {
        username: this.configService.get<string>('elastic.user'),
        password: this.configService.get<string>('elastic.password'),
      },
    });
  }

  async onModuleInit() {
    // Test Elasticsearch connection when module is initialized
    await this.testElasticsearchConnection();
  }

  // Test Elasticsearch connection
  async testElasticsearchConnection() {
    try {
      await this.client.ping();
      this.logger.log('Elasticsearch is connected and available');
    } catch (error) {
      this.logger.error('Elasticsearch is down!', error);
    }
  }

  // Helper to get the current timestamp using TimeService
  private getCurrentTimestamp(): string {
    return this.timeService.getCurrentTime();
  }

  async index(id: string, document: any) {
    const body = {
      ...document,
      timestamp: this.getCurrentTimestamp(), // Use helper method for timestamp
      location: {
        lat: document.latitude,
        lon: document.longitude,
      },
    };

    try {
      return await this.client.index({
        index: this.configService.get<string>('elastic.index'),
        id,
        body,
      });
    } catch (error) {
      this.logger.error('Error indexing document', error);
      throw new InternalServerErrorException('Error indexing document');
    }
  }

  async update(id: string, document: any) {
    try {
      const exists = await this.client.exists({
        index: this.configService.get<string>('elastic.index'),
        id,
      });

      if (!exists) {
        await this.index(id, document);
      } else {
        const body = {
          ...document,
          timestamp: this.getCurrentTimestamp(), // Use helper method for timestamp
        };
        await this.client.update({
          index: this.configService.get<string>('elastic.index'),
          id,
          body: { doc: body },
        });
      }
    } catch (error) {
      this.logger.error('Error updating document', error);
      throw new InternalServerErrorException('Failed to update customer in Elasticsearch');
    }
  }

  async delete(id: string) {
    try {
      return await this.client.delete({
        index: this.configService.get<string>('elastic.index'),
        id,
      });
    } catch (error) {
      this.logger.error('Error deleting document', error);
      throw new InternalServerErrorException('Error deleting document');
    }
  }

  async logException(document: any) {
    const exceptionIndex = this.configService.get<string>('elastic.exceptionIndex', 'exception_logs');
    
    const body = {
      ...document,
      timestamp: this.getCurrentTimestamp(), // Use helper method for timestamp
    };

    this.logger.debug(`Logging exception to index: ${exceptionIndex}`);
    this.logger.debug(`Document: ${JSON.stringify(body)}`);
  
    try {
      await this.client.index({
        index: exceptionIndex,  // Ensure the index name is correct
        body: body,  // Ensure the document is properly structured
      });
      this.logger.log('Exception logged to Elasticsearch successfully');
    } catch (error) {
      this.logger.error('Error logging exception to Elasticsearch', error);
      throw new InternalServerErrorException('Failed to log exception in Elasticsearch');
    }
  }

  private async searchByString(query: string) {
    const searchQuery = {
      index: this.configService.get<string>('elastic.index'),
      body: {
        query: {
          query_string: {
            query: `*${query}*`,
            fields: ['*'],
            default_operator: 'AND',
          },
        },
      },
    };

    try {
      const result = await this.client.search(searchQuery);
      this.logger.log(`Constructed string query: ${JSON.stringify(searchQuery, null, 2)}`);
      return result.hits.hits.map((hit) => hit._source);
    } catch (error) {
      this.logger.error('Error performing string search', error);
      throw new InternalServerErrorException('Error performing string search');
    }
  }

  //(range search for floating-point numbers)
  private async searchByNumeric(numericQuery: number) {
    const searchQuery = {
      index: this.configService.get<string>('elastic.index'), //default index from your config
      body: {
        query: {
          query_string: {
            query: numericQuery.toString(), // Convert numeric query to string for flexibility
            fields: ['*'], // Search across all fields
            default_operator: 'AND', // Use AND to ensure all terms must match
          },
        },
      },
    };
  
    try {
      const result = await this.client.search(searchQuery);
      this.logger.log(`Constructed numeric query: ${JSON.stringify(searchQuery, null, 2)}`); // Log the constructed query
      return result.hits.hits.map((hit) => hit._source); // Return the _source part of each hit
    } catch (error) {
      this.logger.error('Error performing numeric search', error);
      throw new InternalServerErrorException('Error performing numeric search');
    }
  }
  

  // Main search function
  async searchEntities(query: string) {
    this.logger.log(`Starting search for: ${query.toLowerCase()}`);

    // Check if the query is numeric
    const isNumeric = !isNaN(parseFloat(query));

    if (isNumeric) {
      const numericQuery = parseFloat(query);
      return this.searchByNumeric(numericQuery);
    } else {
      return this.searchByString(query);
    }
  }

  // Existing search method (if still required)
  async search(query: string, lat?: number, lon?: number, distance?: string) {
    this.logger.log(`Searching for: ${query.toLowerCase()}`);
    const lowerCaseQuery = query.toLowerCase();
    
    const baseQuery: any = {
      index: this.configService.get<string>('elastic.index'),
      body: {
        query: {
          bool: {
            must: [
              {
                multi_match: {
                  query: lowerCaseQuery,
                  fields: ['doctorName', 'doctorProfessional', 'doctorCityLocation'],
                  analyzer: 'custom_lowercase_analyzer'
                }
              }
            ],
            filter: []
          }
        }
      }
    };
  
    if (lat !== undefined && lon !== undefined && distance) {
      baseQuery.body.query.bool.filter.push({
        geo_distance: {
          distance: distance,
          location: {
            lat: lat,
            lon: lon
          }
        }
      });
    }
  
    this.logger.log(`Constructed query: ${JSON.stringify(baseQuery, null, 2)}`);
  
    try {
      return await this.client.search(baseQuery);
    } catch (error) {
      this.logger.error('Error performing search', error);
      throw new InternalServerErrorException('Error performing search');
    }
  }
}