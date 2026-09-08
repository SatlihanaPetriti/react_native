import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { MyErrorHandler } from 'src/ErrorHandler/handleError';
import { HttpStatus } from '@nestjs/common';

const OTP_TTL_MS = 5 * 60 * 1000;

@Injectable()
export class AuthService {
    // Ruajtje e perkohshme e kodeve OTP ne memorie (mjafton per dev/test)
    private otpStore = new Map<string, { code: string; expiresAt: number }>();

    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) { }

    public requestOtp(phoneNumber: string) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        this.otpStore.set(phoneNumber, { code, expiresAt: Date.now() + OTP_TTL_MS });

        // DEV MODE: kthejme kodin direkt ne response, ne vend qe ta dergojme me SMS
        return { message: 'Code sent', code };
    }

    public async verifyOtp(phoneNumber: string, code: string) {
        const entry = this.otpStore.get(phoneNumber);
        if (!entry || entry.expiresAt < Date.now()) {
            throw new MyErrorHandler('Code expired, request a new one', HttpStatus.UNAUTHORIZED);
        }
        if (entry.code !== code) {
            throw new MyErrorHandler('Invalid code', HttpStatus.UNAUTHORIZED);
        }
        this.otpStore.delete(phoneNumber);

        let user = await this.userService.findByPhone(phoneNumber);
        let isNewUser = false;

        if (!user) {
            user = await this.userService.createByPhone(phoneNumber);
            isNewUser = true;
        }

        const token = await this.jwtService.signAsync({ id: user.id });
        return { user, token, isNewUser };
    }
}
