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
    constructor(message: string) {
        super(
            {
                message,
                status: HttpStatus.BAD_REQUEST,
            },
            HttpStatus.BAD_REQUEST,
        );
    }
}
