import { Controller, Body, Patch, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

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

    @Patch(':id/name')
    public async updateName(@Param('id') id: string, @Body('name') name: string) {
        return this.userService.updateName(Number(id), name);
    }

}
