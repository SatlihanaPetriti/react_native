import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from '../user/DTO/user.dto';
import { PhoneLoginDto } from '../user/DTO/login.dto';
import type { Response } from 'express';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    public async register(@Body() param: UserDto, @Res({ passthrough: true }) response: Response) {
        const { user, token } = await this.authService.register(param);
        response.cookie('jwt', token, { httpOnly: true, secure: false, sameSite: 'lax' });
        return { user, token };
    }

    @Post('phone-login')
    public async phoneLogin(@Body() param: PhoneLoginDto, @Res({ passthrough: true }) response: Response) {
        const { user, token } = await this.authService.loginWithPhone(param.phoneNumber, param.password);
        response.cookie('jwt', token, { httpOnly: true, secure: false, sameSite: 'lax' });
        return { user, token };
    }

    @Post('logout')
    public async logout(@Res({ passthrough: true }) response: Response) {
        response.clearCookie('jwt');
        return { "message": "success", "status": 201 };
    }
}