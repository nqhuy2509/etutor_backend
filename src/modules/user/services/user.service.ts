import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../../models/schemas/user.schema';
import { Model } from 'mongoose';
import { RegisterDto } from '../dtos/register.dto';
import * as bcrypt from 'bcrypt';
import {
    BadRequestException,
    NotFoundException,
} from '../../../common/response';
import { responseCode } from '../../../common/response_code';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
    ) {}

    async createNewUser(data: {
        username: string;
        email: string;
        password?: string;
    }) {
        const user = new this.userModel();

        const existUser = await this.findUserByEmailOrUsername(
            data.email,
            data.username,
        );

        if (existUser) {
            throw new BadRequestException(
                responseCode.auth.register.user_already_exists,
            );
        }

        user.username = data.username;
        user.email = data.email;

        if (data.password) {
            user.password = await bcrypt.hash(data.password, 10);
        }

        return user;
    }

    async findUserByEmailOrUsername(email: string, username: string) {
        return this.userModel.findOne({
            $or: [{ username }, { email }],
        });
    }

    async updateUser(id: string, data: any) {
        const user = await this.userModel.findById(id);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        user.verifyCode = data.verifyCode || user.verifyCode;
        user.status = data.status || user.status;

        await user.save();

        return user;
    }

    async deleteUser(id: string) {
        const user = await this.userModel.findById(id);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        await user.deleteOne({
            _id: id,
        });
        return user;
    }
}
