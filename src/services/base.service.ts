import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { Repository, EntityManager } from 'typeorm';
import { ElasticsearchService } from 'src/elasticsearch/elasticsearch.service';
import { BaseEntity } from 'typeorm';

@Injectable()
export abstract class BaseService<T extends BaseEntity> {
  protected readonly logger = new Logger(BaseService.name);

  constructor(
    protected readonly repository: Repository<T>,
    protected readonly elasticsearchService: ElasticsearchService,
  ) {}

  async create(entity: T, elasticId: string, manager: EntityManager): Promise<T> {
    return await manager.transaction(async transactionalEntityManager => {
      const savedEntity = await transactionalEntityManager.save(this.repository.create(entity));

      // Index the new entity in Elasticsearch
      try {
        await this.elasticsearchService.index(elasticId, savedEntity);
      } catch (error) {
        this.logger.error('Failed to index entity in Elasticsearch', error);
        throw new InternalServerErrorException('Failed to index entity in Elasticsearch');
      }

      return savedEntity;
    });
  }

  async update(id: number, updateData: Partial<T>, manager: EntityManager): Promise<T> {
    return await manager.transaction(async transactionalEntityManager => {
      // Query the entity by its ID
      const entity = await transactionalEntityManager.findOne(this.repository.target as any, {
        where: { id } as any,
      }) as T;

      if (!entity) {
        this.logger.error(`Entity with ID ${id} not found`);
        throw new NotFoundException('Entity not found');
      }

      await transactionalEntityManager.update(this.repository.target as any, id, updateData as any);

      const updatedEntity = await transactionalEntityManager.findOne(this.repository.target as any, {
        where: { id } as any,
      }) as T;

      // Update Elasticsearch index
      try {
        await this.elasticsearchService.update(id.toString(), updatedEntity);
      } catch (error) {
        this.logger.error('Failed to update entity in Elasticsearch', error);
        throw new InternalServerErrorException('Failed to update entity in Elasticsearch');
      }

      return updatedEntity;
    });
  }

  async remove(id: number, manager: EntityManager): Promise<void> {
    try {
      await manager.transaction(async transactionalEntityManager => {
        await transactionalEntityManager.delete(this.repository.target as any, id);

        // Remove from Elasticsearch
        try {
          await this.elasticsearchService.delete(id.toString());
        } catch (error) {
          this.logger.error('Failed to delete entity from Elasticsearch', error);
          throw new InternalServerErrorException('Failed to delete entity from Elasticsearch');
        }
      });
    } catch (error) {
      this.logger.error('Failed to delete entity', error);
      throw new InternalServerErrorException('Failed to delete entity');
    }
  }

  async findOne(id: number): Promise<T> {
    const entity = await this.repository.findOne({
      where: { id } as any,
    });

    if (!entity) {
      this.logger.error(`Entity with ID ${id} not found`);
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }
    return entity;
  }
}
