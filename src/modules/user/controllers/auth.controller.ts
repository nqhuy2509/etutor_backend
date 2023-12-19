import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
    Version,
    Request,
} from '@nestjs/common';
import { RegisterDto } from '../dtos/register.dto';
import { AuthService } from '../services/auth.services';
import { SuccessResponse } from '../../../common/response';
import { ApiTags } from '@nestjs/swagger';
import { VerifyDto } from '../dtos/verify.dto';
import { LocalAuthGuard } from '../../../guards/local-auth.guard';
import { GoogleLoginDto } from '../dtos/login.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @Version('1')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() dto: RegisterDto) {
        await this.authService.createNewUser(dto);
        return new SuccessResponse(
            'Register success',
            null,
            null,
            HttpStatus.CREATED,
        );
    }

    @Post('verify')
    @Version('1')
    @HttpCode(HttpStatus.OK)
    async verify(@Body() dto: VerifyDto) {
        const { accessToken, user } = await this.authService.verify(dto);

        const { username, email } = user;

        return new SuccessResponse(
            'Verify success',
            {
                accessToken,
                user: {
                    username,
                    email,
                },
            },
            null,
            HttpStatus.OK,
        );
    }

    @Post('resend-verify')
    @Version('1')
    @HttpCode(HttpStatus.OK)
    async resendVerify(@Body() body: { email: string }) {
        await this.authService.resendVerify(body);

        return new SuccessResponse(
            'Resend verify code success',
            null,
            null,
            HttpStatus.OK,
        );
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @Version('1')
    @HttpCode(HttpStatus.OK)
    async login(@Request() req: any) {
        const token = await this.authService.login(req.user);

        return new SuccessResponse(null, token, null, HttpStatus.OK);
    }

    @Post('google')
    @Version('1')
    @HttpCode(HttpStatus.OK)
    async googleLogin(@Body() dto: GoogleLoginDto) {
        const token = await this.authService.loginWithGoogle(dto);

        return new SuccessResponse(null, token, null, HttpStatus.OK);
    }
}
