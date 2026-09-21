import { Controller, Body, Patch, Get, Param, Req, HttpStatus } from '@nestjs/common';
import type { Request } from 'express';
import { UserService } from './user.service';
import { UpdateProfileDto } from './DTO/update-profile.dto';
import { MyErrorHandler } from 'src/ErrorHandler/handleError';

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

    @Patch(':id/profile')
    public async updateProfile(
        @Param('id') id: string,
        @Body() dto: UpdateProfileDto,
        @Req() req: Request,
    ) {
        // useri mund te ndryshoje vetem profilin e vet
        if (req.user?.id !== Number(id)) {
            throw new MyErrorHandler('You can only edit your own profile', HttpStatus.FORBIDDEN);
        }
        return this.userService.updateProfile(Number(id), dto);
    }

}
