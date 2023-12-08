import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../../models/schemas/user.schema';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.services';
import { MailerService } from './services/mailer.service';
import { UserService } from './services/user.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'User',
                schema: UserSchema,
            },
        ]),
        PassportModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, MailerService, UserService, LocalStrategy],
})
export class UserModule {}
