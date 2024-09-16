import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CustomerService } from 'src/services/customer.service';
import { CreateCustomerDto } from 'src/dto/customer.dto';
import { Customer } from 'src/entities/customer.entity';
import { EntityManager } from 'typeorm';

@Controller('customers')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly entityManager: EntityManager,
  ) {}

  @Get()
  async findAll(): Promise<Customer[]> {
    return this.entityManager.transaction(async manager => {
      return this.customerService.findAll();
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Customer> {
    return this.entityManager.transaction(async manager => {
      return this.customerService.findOne(+id);
    });
  }

  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return this.entityManager.transaction(async manager => {
      const customer = await this.customerService.createCustomer(createCustomerDto, manager);
      return this.customerService.findOne(customer.id);
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCustomerDto: CreateCustomerDto): Promise<Customer> {
    return this.entityManager.transaction(async manager => {
      return this.customerService.updateCustomer(+id, updateCustomerDto, manager);
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.entityManager.transaction(async manager => {
      return this.customerService.deleteCustomer(+id, manager);
    });
  }
}
