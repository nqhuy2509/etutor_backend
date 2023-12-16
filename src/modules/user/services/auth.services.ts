import { Injectable } from '@nestjs/common';
import { RegisterDto } from '../dtos/register.dto';
import * as bcrypt from 'bcrypt';
import {
    BadRequestException,
    InternalServerErrorException,
    UnauthorizedException,
} from '../../../common/response';
import { MailerService } from './mailer.service';
import { VerifyDto } from '../dtos/verify.dto';
import { StatusUser } from '../../../common/enums';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { responseCode } from '../../../common/response_code';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private mailerService: MailerService,
        private jwtService: JwtService,
    ) {}

    async createNewUser(dto: RegisterDto) {
        const existUser = await this.userService.findUserByEmailOrUsername(
            dto.email,
            dto.username,
        );

        if (
            existUser &&
            (existUser.status === StatusUser.active ||
                existUser.status === StatusUser.suspend)
        ) {
            throw new BadRequestException(
                responseCode.auth.register.user_already_exists,
            );
        }

        const user = await this.userService.createNewUser(dto);

        try {
            await this.sendAndSaveVerifyCode(user);
        } catch (e) {
            console.log(e);
            throw new InternalServerErrorException(
                responseCode.some_things_went_wrong,
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

        user.status = StatusUser.verified;

        await user.save();

        const payload = { email: user.email, sub: user._id };

        return {
            user,
            accessToken: this.jwtService.sign(payload),
        };
    }

    async validateUser(email: string, pass: string) {
        const user = await this.userService.findUserByEmailOrUsername(
            email,
            '',
        );

        if (!user) {
            throw new UnauthorizedException(
                responseCode.auth.login.invalid_credentials,
            );
        }

        const isMatch = await bcrypt.compare(pass, user.password);

        if (!isMatch) {
            return null;
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user.toJSON();

        return result;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user._id };

        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async resendVerify(dto: { email: string }) {
        const user = await this.userService.findUserByEmailOrUsername(
            dto.email,
            '',
        );

        try {
            await this.sendAndSaveVerifyCode(user);
        } catch (e) {
            console.log(e);
            throw new InternalServerErrorException(
                responseCode.some_things_went_wrong,
            );
        }

        return user;
    }

    private generateVerifyCode() {
        return Math.floor(100000 + Math.random() * 900000);
    }

    private async sendAndSaveVerifyCode(user: any) {
        const code = this.generateVerifyCode();
        user.verifyCode = code.toString();
        // await this.mailerService.createSendEmailCommand(
        //     user.email,
        //     'Xác thực tài khoản',
        //     `Mã xác thực tài khoản của bạn là: ${code}`,
        // );
        await user.save();
    }
}
