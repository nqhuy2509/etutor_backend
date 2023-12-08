import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../../models/schemas/user.schema';
import { Model } from 'mongoose';
import { RegisterDto } from '../dtos/register.dto';
import * as bcrypt from 'bcrypt';
import { NotFoundException } from '../../../common/response';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
    ) {}

    async createNewUser(dto: RegisterDto) {
        const user = new this.userModel();
        user.username = dto.username;
        user.email = dto.email;

        user.password = await bcrypt.hash(dto.password, 10);

        await user.save();

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
}
