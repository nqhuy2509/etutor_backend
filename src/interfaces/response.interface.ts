export interface ISuccessResponse {
    message: string;
    data?: any;
    status?: number;
    meta?: any;
}

export interface IErrorResponse {
    message: string;
    status?: number;
    error?: any;
}
