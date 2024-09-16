import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Customer } from 'src/entities/customer.entity';
import { ElasticsearchService } from 'src/elasticsearch/elasticsearch.service';
import { BaseService } from 'src/services/base.service';
import { CreateCustomerDto } from 'src/dto/customer.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class CustomerService extends BaseService<Customer> {
  constructor(
    @InjectRepository(Customer)
    repository: Repository<Customer>,
    elasticsearchService: ElasticsearchService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(repository, elasticsearchService);
  }

  async createCustomer(createCustomerDto: CreateCustomerDto, manager: EntityManager): Promise<Customer> {
    const { userId, phoneNumber } = createCustomerDto;
  
    const user = await manager.findOne(User, { where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  
    const customer = this.repository.create({
      phoneNumber,
      user,
    });
  
    // Save customer to the database to get the generated ID
    const savedCustomer = await this.repository.save(customer);
  
    // Now that we have the generated ID, we can pass it to Elasticsearch
    await this.create(savedCustomer, savedCustomer.id.toString(), manager);
  
    return savedCustomer;
  }
  

  async updateCustomer(id: number, updateCustomerDto: CreateCustomerDto, manager: EntityManager): Promise<Customer> {
    const { phoneNumber } = updateCustomerDto;

    const customer = await this.findOne(id);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return this.update(id, { phoneNumber } as Partial<Customer>, manager);
  }

  async deleteCustomer(id: number, manager: EntityManager): Promise<void> {
    return this.remove(id, manager);
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.repository.findOne({ where: { id }, relations: ['user'] });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  async findAll(): Promise<Customer[]> {
    return this.repository.find({ relations: ['user'] });
  }
}
