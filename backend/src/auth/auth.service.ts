import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { UserDto } from 'src/user/DTO/user.dto';
import bcrypt from 'bcrypt';
import { MyErrorHandler } from 'src/ErrorHandler/handleError';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) { }

    public async register(data: UserDto) {
        const isUser = await this.userService.findByEmailOrNull(data.email);
        if (isUser) {
            throw new MyErrorHandler('User already exists', HttpStatus.CONFLICT) //409
        }
        const hashedPassword = await bcrypt.hash(data.password, 10)
        const user = await this.userService.create({
            ...data, password: hashedPassword,
        });
        const token = await this.jwtService.signAsync({ id: user.id });
        return { user, token };
    }

    public async loginWithPhone(phoneNumber: string, password: string) {
        const user = await this.userService.findByPhone(phoneNumber);
        if (!user) {
            throw new MyErrorHandler('User not found', HttpStatus.NOT_FOUND); // phoneNumber nk ekziston
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new MyErrorHandler('Invalid credentials', HttpStatus.UNAUTHORIZED); // password gabim
        }

        const token = await this.jwtService.signAsync({ id: user.id });
        return { user, token };
    }
}