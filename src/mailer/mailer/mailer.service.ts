import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,// or use SMTP settings
            auth: {
                user: process.env.MAIL_USER, // Your email
                pass: process.env.MAIL_PASS, // App password or email password
            },
        });
    }

    async sendMail(to: string, subject: string, text: string, html?: string) {
        const mailOptions = {
            from: process.env.MAIL_USER, // Sender email
            to,
            subject,
            text,
            html,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent: ', info.response);
            return info;
        } catch (error) {
            console.error('Error sending email: ', error);
            throw error;
        }
    }
}
