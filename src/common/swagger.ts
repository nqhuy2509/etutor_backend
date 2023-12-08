import { DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
    .setTitle('Etutor documentation')
    .setDescription('Api document for Etutor')
    .setVersion('1.0')
    .addTag('Etutor')
    .build();

export default config;
