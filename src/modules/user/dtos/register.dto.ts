import { IsNotEmpty } from 'class-validator';

export class RegisterDto {
    @IsNotEmpty()
    readonly username: string;

    @IsNotEmpty()
    readonly password: string;

    @IsNotEmpty()
    readonly email: string;
}
