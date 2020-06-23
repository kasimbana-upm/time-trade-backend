import { Controller, Get, Post, Body, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEmailConflictInterceptor } from '../interceptors/user-email-conflict.interceptor';

@Controller('users')
@UseInterceptors(UserEmailConflictInterceptor)
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Post()
    create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.usersService.create(createUserDto);
    }
}
