import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { Socket } from 'socket.io';

function parseCookies(cookieHeader: string): Record<string, string> {
    return cookieHeader
        .split(';')
        .map((pair) => pair.trim().split('='))
        .reduce((acc, [key, value]) => {
            if (key) acc[key] = decodeURIComponent(value || '');
            return acc;
        }, {} as Record<string, string>);
}

@Injectable()
export class WsJwtGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const client: Socket = context.switchToWs().getClient();

        const rawCookie = client.handshake.headers.cookie;
        if (!rawCookie) {
            client.disconnect();
            return false;
        }

        const parsed = parseCookies(rawCookie);
        const token = parsed.jwt;
        if (!token) {
            client.disconnect();
            return false;
        }

        let payload: { id: number };
        try {
            payload = this.jwtService.verify(token);
        } catch (err) {
            client.disconnect();
            return false;
        }

        const user = await this.userService.findOne(payload.id);
        if (!user) {
            client.disconnect();
            return false;
        }

        client.data.user = user;
        return true;
    }
}