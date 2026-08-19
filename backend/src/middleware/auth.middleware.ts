import { HttpStatus, Injectable, NestMiddleware, UnauthorizedException} from '@nestjs/common'
import { Request, Response, NextFunction } from 'express';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { MyErrorHandler } from 'src/ErrorHandler/handleError';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
    ) { }
    
    async use(req: Request, res: Response, next: NextFunction) {
        const token = req.cookies?.jwt; 
        if (!token){
            throw new MyErrorHandler('No token', HttpStatus.UNAUTHORIZED);
        } 
        let payload: { id: number };
        try {
            payload = this.jwtService.verify(token);
        } catch (err) {
            throw new MyErrorHandler('Invalid or expired token', HttpStatus.UNAUTHORIZED);
        }

        const user = await this.userService.findOne(payload.id);
        if (!user) throw new MyErrorHandler('User not found', HttpStatus.NOT_FOUND);

        req.user = user;
        next();
    
    }
}
