import { HttpException, HttpStatus } from '@nestjs/common';

export class MyErrorHandler extends HttpException {
    constructor(message: string, status: HttpStatus) {
        super(message, status)
    }
}