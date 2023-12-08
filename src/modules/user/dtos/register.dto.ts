import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty()
    @IsNotEmpty()
    readonly username: string;

    @ApiProperty()
    @IsNotEmpty()
    readonly password: string;

    @ApiProperty()
    @IsNotEmpty()
    readonly email: string;
}
