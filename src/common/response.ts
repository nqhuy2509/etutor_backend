import { HttpException, HttpStatus } from '@nestjs/common';
import { ISuccessResponse } from '../interfaces/response.interface';

export class SuccessResponse implements ISuccessResponse {
    data: any;
    message: string;
    meta: any;
    status: number;

    constructor(message: string, data: any, meta?: any, status?: number) {
        this.message = message;
        this.data = data;
        this.meta = meta;
        this.status = status || HttpStatus.OK;
    }
}

export class BadRequestException extends HttpException {
    constructor(message: string, data?: any) {
        super(
            {
                message,
                status: HttpStatus.BAD_REQUEST,
                data,
            },
            HttpStatus.BAD_REQUEST,
        );
    }
}

export class InternalServerErrorException extends HttpException {
    constructor(message: string, data?: any) {
        super(
            {
                message,
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                data,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
}

export class NotFoundException extends HttpException {
    constructor(message: string, data?: any) {
        super(
            {
                message,
                status: HttpStatus.NOT_FOUND,
                data,
            },
            HttpStatus.NOT_FOUND,
        );
    }
}

export class UnauthorizedException extends HttpException {
    constructor(message: string, data?: any) {
        super(
            {
                message,
                status: HttpStatus.UNAUTHORIZED,
                data,
            },
            HttpStatus.UNAUTHORIZED,
        );
    }
}
