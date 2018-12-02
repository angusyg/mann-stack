import { Body, Controller, Get, HttpCode, Post, UseFilters, ValidationPipe } from '@nestjs/common';

import { MongoExceptionFilter } from '../lib/filters/mongo-exception.filter';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Tokens } from './interfaces/tokens.interface';
import { User } from './interfaces/user.interface';
import { UsersService } from './users.service';

@Controller('users')
@UseFilters(MongoExceptionFilter)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  public async create(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  public async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Post('login')
  @HttpCode(200)
  public async login(@Body(ValidationPipe) loginDto: LoginDto): Promise<Tokens> {
    return await this.usersService.login(loginDto);
  }
}
