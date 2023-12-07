import { Injectable } from '@nestjs/common';
import { RegisterDto } from '../dtos/register.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../../models/schemas/user.schema';
import { Model } from 'mongoose';
import { I18nContext, I18nService } from 'nestjs-i18n';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '../../../common/response';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        private readonly i18n: I18nService,
    ) {}

    async createNewUser(dto: RegisterDto) {
        const existUser = await this.userModel.findOne({
            $or: [{ username: dto.username }, { email: dto.email }],
        });

        if (existUser) {
            throw new BadRequestException(
                this.i18n.t('message.user_already_exists', {
                    lang: I18nContext.current().lang,
                }),
            );
        }

        const user = new this.userModel();
        user.username = dto.username;
        user.email = dto.email;

        user.password = await bcrypt.hash(dto.password, 10);

        await user.save();

        return user;
    }
}
