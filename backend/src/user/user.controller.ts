import { Controller, Body, Post, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './DTO/user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    public async create(@Body() body: UserDto) {
        return this.userService.create(body);
    }


    @Get('all')
    public async findAll() {
        return this.userService.findAll();
    }
    
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userService.findOne(Number(id));
    }

    @Get('email/:email')
    public async findByEmail(@Param('email') email: string) {
        return this.userService.findByEmail(email)
    }

}