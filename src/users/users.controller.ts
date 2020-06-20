import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/schemas/user.schema';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }
}
