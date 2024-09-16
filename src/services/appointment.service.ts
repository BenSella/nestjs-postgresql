import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../entities/appointment.entity';
import { CreateAppointmentDto } from 'src/dto/appointment.dto';
import { ElasticsearchService } from 'src/elasticsearch/elasticsearch.service';
import { User } from '../entities/user.entity';
import { ServiceProvider } from '../entities/service_provider.entity';
import { Customer } from '../entities/customer.entity';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    
    @InjectRepository(User)
    private userRepository: Repository<User>,
    
    @InjectRepository(ServiceProvider)
    private serviceProviderRepository: Repository<ServiceProvider>,
    
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  async findAll(): Promise<Appointment[]> {
    return this.appointmentRepository.find({ relations: ['user', 'serviceProvider', 'customer'] });
  }

  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({ where: { id }, relations: ['user', 'serviceProvider', 'customer'] });
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    return appointment;
  }

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    const { userId, serviceProviderId, customerId, ...appointmentData } = createAppointmentDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const serviceProvider = await this.serviceProviderRepository.findOne({ where: { id: serviceProviderId } });
    if (!serviceProvider) {
      throw new NotFoundException(`Service Provider with ID ${serviceProviderId} not found`);
    }

    const customer = await this.customerRepository.findOne({ where: { id: customerId } });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    const appointment = this.appointmentRepository.create({
      ...appointmentData,
      user,
      serviceProvider,
      customer,
    });

    const savedAppointment = await this.appointmentRepository.save(appointment);

    // Optional: Elasticsearch indexing
    try {
      // await this.elasticsearchService.index(savedAppointment.id.toString(), savedAppointment);
    } catch (error) {
      throw new InternalServerErrorException('Failed to index appointment in Elasticsearch');
    }

    return savedAppointment;
  }

  async update(id: number, updateAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    const { userId, serviceProviderId, customerId, ...appointmentData } = updateAppointmentDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const serviceProvider = await this.serviceProviderRepository.findOne({ where: { id: serviceProviderId } });
    if (!serviceProvider) {
      throw new NotFoundException(`Service Provider with ID ${serviceProviderId} not found`);
    }

    const customer = await this.customerRepository.findOne({ where: { id: customerId } });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    await this.appointmentRepository.update(id, { ...appointmentData, user, serviceProvider, customer });
    const updatedAppointment = await this.findOne(id);

    // Update the appointment in Elasticsearch
    try {
      // await this.elasticsearchService.update(id.toString(), updatedAppointment);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update appointment in Elasticsearch');
    }

    return updatedAppointment;
  }

  async remove(id: number): Promise<void> {
    await this.appointmentRepository.delete(id);

    // Delete the appointment from Elasticsearch
    try {
      // await this.elasticsearchService.delete(id.toString());
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete appointment from Elasticsearch');
    }
  }
}