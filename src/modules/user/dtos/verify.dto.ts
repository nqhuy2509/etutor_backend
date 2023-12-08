import { IsNotEmpty, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumberString()
    verifyCode: string;

    @ApiProperty()
    @IsNotEmpty()
    email: string;
}
