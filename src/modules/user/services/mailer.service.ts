import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class MailerService {
    ses: AWS.SES;

    constructor() {
        this.ses = new AWS.SES({
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
            region: process.env.AWS_DEFAULT_REGION,
        });
    }

    createSendEmailCommand(toAddress: string, subject: string, body: string) {
        const params: AWS.SES.SendEmailRequest = {
            Destination: {
                ToAddresses: [toAddress],
            },
            Source: process.env.SES_FROM_ADDRESS,
            Message: {
                Subject: {
                    Data: subject,
                    Charset: 'UTF-8',
                },
                Body: {
                    Text: {
                        Data: body,
                        Charset: 'UTF-8',
                    },
                },
            },
        };

        return this.ses.sendEmail(params).promise();
    }
}
