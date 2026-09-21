import { Controller, Body, Patch, Get, Param, Req, HttpStatus } from '@nestjs/common';
import type { Request } from 'express';
import { UserService } from './user.service';
import { UpdateProfileDto } from './DTO/update-profile.dto';
import { UserEntity } from './Entity/user.entity';
import { MyErrorHandler } from 'src/ErrorHandler/handleError';

// Userat e tjere shohin vetem kete - jo email, telefon apo role
const toPublicUser = ({ id, name, lastname }: UserEntity) => ({ id, name, lastname });

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('all')
    public async findAll() {
        const users = await this.userService.findAll();
        return users.map(toPublicUser);
    }

    @Get(':id')
    public async findOne(@Param('id') id: string) {
        return toPublicUser(await this.userService.findOne(Number(id)));
    }

    @Get('email/:email')
    public async findByEmail(@Param('email') email: string) {
        return toPublicUser(await this.userService.findByEmail(email));
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
