import { Body, Controller, HttpCode, HttpStatus, Post, Version } from '@nestjs/common';
import { I18n, I18nContext } from 'nestjs-i18n';
import { RegisterDto } from '../dtos/register.dto';
import { AuthService } from '../services/auth.services';
import { SuccessResponse } from '../../../common/response';
import { ApiTags } from '@nestjs/swagger';
import { VerifyDto } from '../dtos/verify.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @Version('1')
    @HttpCode(HttpStatus.CREATED)
    async register(@I18n() i18n: I18nContext, @Body() dto: RegisterDto) {
        await this.authService.createNewUser(dto);
        return new SuccessResponse(
            i18n.t('message.register_success'),
            null,
            null,
            HttpStatus.CREATED,
        );
    }

    @Post('verify')
    @Version('1')
    @HttpCode(HttpStatus.OK)
    async verify(@I18n() i18n: I18nContext, @Body() dto: VerifyDto) {
        await this.authService.verify(dto);

        return new SuccessResponse(
            i18n.t('message.verify_email_success'),
            null,
            null,
            HttpStatus.OK,
        );
    }
}
