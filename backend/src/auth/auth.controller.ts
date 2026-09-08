import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestOtpDto, VerifyOtpDto } from '../user/DTO/otp.dto';
import type { Response } from 'express';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('otp/request')
    public requestOtp(@Body() param: RequestOtpDto) {
        return this.authService.requestOtp(param.phoneNumber);
    }

    @Post('otp/verify')
    public async verifyOtp(@Body() param: VerifyOtpDto, @Res({ passthrough: true }) response: Response) {
        const { user, token, isNewUser } = await this.authService.verifyOtp(param.phoneNumber, param.code);
        response.cookie('jwt', token, { httpOnly: true, secure: false, sameSite: 'lax' });
        return { user, token, isNewUser };
    }

    @Post('logout')
    public async logout(@Res({ passthrough: true }) response: Response) {
        response.clearCookie('jwt');
        return { "message": "success", "status": 201 };
    }
}
