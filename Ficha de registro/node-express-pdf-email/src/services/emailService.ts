import nodemailer from 'nodemailer';
import { EmailData } from '../types';

export class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendEmail(emailData: EmailData): Promise<void> {
        const mailOptions = {
            from: emailData.from,
            to: emailData.to,
            subject: emailData.subject,
            text: emailData.text,
            attachments: emailData.attachments,
        };

        await this.transporter.sendMail(mailOptions);
    }
}