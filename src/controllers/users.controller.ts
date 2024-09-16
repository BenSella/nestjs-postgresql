import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { UsersService } from 'src/services/users.service';
import { CreateUserDto } from 'src/dto/user.dto';
import { EntityManager } from 'typeorm';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly entityManager: EntityManager, // Inject EntityManager
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.entityManager.transaction(async manager => {
      return this.usersService.createUser(createUserDto, manager);
    });
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() createUserDto: CreateUserDto) {
    return this.entityManager.transaction(async manager => {
      return this.usersService.updateUser(id, createUserDto, manager);
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.entityManager.transaction(async manager => {
      return this.usersService.deleteUser(id, manager);
    });
  }
}
