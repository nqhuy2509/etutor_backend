import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { StatusUser } from '../../common/enums';
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

    @Prop({ required: true })
    password: string;

    @Prop()
    verifyCode: string;

    @Prop({ type: String, enum: StatusUser, default: StatusUser.pending })
    @IsEnum(StatusUser)
    status: StatusUser;
}

export const UserSchema = SchemaFactory.createForClass(User);
