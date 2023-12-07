import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import {
    AcceptLanguageResolver,
    HeaderResolver,
    I18nModule,
} from 'nestjs-i18n';
import * as path from 'path';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forRoot(process.env.MONGO_URI),
        I18nModule.forRoot({
            fallbackLanguage: 'en',
            loaderOptions: {
                path: path.join(__dirname, '/i18n/'),
                watch: true,
            },
            resolvers: [
                { use: HeaderResolver, options: ['lang'] },
                AcceptLanguageResolver,
            ],
        }),
        UserModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
