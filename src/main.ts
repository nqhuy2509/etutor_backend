import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import * as process from 'process';
import { SwaggerModule } from '@nestjs/swagger';
import swaggerConfig from './common/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['log', 'debug'],
    });

    app.enableCors();

    app.setGlobalPrefix('api');

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        }),
    );

    app.enableVersioning({
        type: VersioningType.URI,
    });

    const document = SwaggerModule.createDocument(app, swaggerConfig);

    SwaggerModule.setup('documentation', app, document);

    await app.listen(process.env.PORT || 3000);
}

bootstrap().then(() => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
