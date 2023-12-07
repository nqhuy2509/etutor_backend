import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { I18n, I18nContext } from 'nestjs-i18n';
import { RegisterDto } from '../dtos/register.dto';
import { AuthService } from '../services/auth.services';
import { SuccessResponse } from '../../../common/response';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@I18n() i18n: I18nContext, @Body() dto: RegisterDto) {
        const user = await this.authService.createNewUser(dto);

        return new SuccessResponse(
            i18n.t('message.register_success'),
            user,
            null,
            HttpStatus.CREATED,
        );
    }
}
