import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../services/auth.services';
import { UnauthorizedException } from '../../../common/response';
import { StatusUser } from '../../../common/enums';
import { responseCode } from '../../../common/response_code';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            usernameField: 'email',
            passwordField: 'password',
        });
    }

    async validate(email: string, password: string): Promise<any> {
        if (!email || !password) {
            throw new UnauthorizedException(
                responseCode.auth.login.invalid_credentials,
            );
        }

        const user = await this.authService.validateUser(email, password);

        if (!user) {
            throw new UnauthorizedException(
                responseCode.auth.login.invalid_credentials,
            );
        }

        if (user.status === StatusUser.suspend) {
            throw new UnauthorizedException(
                responseCode.auth.login.user_is_suspended,
            );
        }

        if (user.status === StatusUser.pending) {
            throw new UnauthorizedException(
                responseCode.auth.login.user_is_not_verify,
            );
        }

        if (user.status === StatusUser.verified) {
            throw new UnauthorizedException(
                responseCode.auth.login.user_is_not_active,
            );
        }

        return user;
    }
}
