import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { HttpStatus } from '@nestjs/common';
import { MyErrorHandler } from '../ErrorHandler/handleError';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    public canActivate(context: ExecutionContext): boolean {

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new MyErrorHandler('No user found', HttpStatus.NOT_FOUND);
        }

        const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
        console.log('----Roles:', requiredRoles);

        if (!requiredRoles) return true;

        const userRoles: string[] = Array.isArray(user.role) ? user.role : [user.role];
        console.log('---UserRole', userRoles);


        const hasRole = requiredRoles.some(role => userRoles.includes(role));
        console.log('----Required role', hasRole);

        if (!hasRole) {
            throw new MyErrorHandler('Access denied', HttpStatus.UNAUTHORIZED);
        }
        return true;
    }
}