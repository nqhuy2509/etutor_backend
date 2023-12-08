import { Injectable } from '@nestjs/common';
import { RegisterDto } from '../dtos/register.dto';
import { I18nContext, I18nService } from 'nestjs-i18n';
import * as bcrypt from 'bcrypt';
import {
    BadRequestException,
    InternalServerErrorException,
} from '../../../common/response';
import { MailerService } from './mailer.service';
import { VerifyDto } from '../dtos/verify.dto';
import { StatusUser } from '../../../common/enums';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly i18n: I18nService,
        private mailerService: MailerService,
    ) {}

    async createNewUser(dto: RegisterDto) {
        const existUser = await this.userService.findUserByEmailOrUsername(
            dto.email,
            dto.username,
        );

        if (existUser) {
            throw new BadRequestException(
                this.i18n.t('message.user_already_exists', {
                    lang: I18nContext.current().lang,
                }),
            );
        }

        const user = await this.userService.createNewUser(dto);

        try {
            const code = this.generateVerifyCode();
            user.verifyCode = code.toString();
            await this.mailerService.createSendEmailCommand(
                user.email,
                this.i18n.t('message.subject_verify_email', {
                    lang: I18nContext.current().lang,
                }),
                this.i18n.t('message.body_verify_email', {
                    lang: I18nContext.current().lang,
                    args: { code },
                }),
            );
            await user.save();
        } catch (e) {
            console.log(e);
            throw new InternalServerErrorException(
                this.i18n.t('message.something_went_wrong', {
                    lang: I18nContext.current().lang,
                }),
            );
        }

        return user;
    }

    async verify(dto: VerifyDto) {
        const user = await this.userService.findUserByEmailOrUsername(
            dto.email,
            '',
        );

        if (user.verifyCode !== dto.verifyCode) {
            throw new BadRequestException('Verify code is not correct');
        }

        user.status = StatusUser.active;

        await user.save();

        return user;
    }

    async validateUser(email: string, pass: string) {
        const user = await this.userService.findUserByEmailOrUsername(
            email,
            '',
        );

        const isMatch = await bcrypt.compare(pass, user.password);

        if (!isMatch) {
            return null;
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user.toJSON();

        return result;
    }

    private generateVerifyCode() {
        return Math.floor(100000 + Math.random() * 900000);
    }
}
