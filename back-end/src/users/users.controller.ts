import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { UsersService } from './users.service';
import { UserDto } from './dto/User.dto';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) { }

    @Get()
    async findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<User | null> {
        return this.usersService.findOne(+id);
    }

    @Post('upsert')
    async upsertUser(@Body() userDto: UserDto): Promise<User> {
        try {
            return await this.usersService.upsertUser(userDto);
        } catch (error) {
            throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.usersService.deleteUser(id);
    }
}
