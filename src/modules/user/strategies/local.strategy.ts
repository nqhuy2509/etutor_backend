import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../services/auth.services';
import { UnauthorizedException } from '../../../common/response';
import { StatusUser } from '../../../common/enums';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super();
    }

    async validate(email: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(email, password);
        if (!user) {
            return new UnauthorizedException('Invalid credentials');
        }

        if (
            user.status === StatusUser.pending ||
            user.status === StatusUser.suspend
        ) {
            return new UnauthorizedException('User is not active');
        }
        return user;
    }
}
