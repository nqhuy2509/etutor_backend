import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { LoginType, StatusUser } from '../../common/enums';
import { IsEnum } from 'class-validator';

export type UserDocument = HydratedDocument<User>;

@Schema({
    _id: true,
    timestamps: true,
})
export class User {
    @Prop({ required: true })
    username: string;

    @Prop({ required: true })
    email: string;

    @Prop()
    password: string;

    @Prop()
    verifyCode: string;

    @Prop({ type: Number, enum: LoginType, default: LoginType.local })
    @IsEnum(LoginType)
    loginType: LoginType;

    @Prop()
    avatarUrl: string;

    @Prop({ type: Number, enum: StatusUser, default: StatusUser.pending })
    @IsEnum(StatusUser)
    status: StatusUser;
}

export const UserSchema = SchemaFactory.createForClass(User);
