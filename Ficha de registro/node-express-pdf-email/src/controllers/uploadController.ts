import { Request, Response } from 'express';
import { EmailService } from '../services/emailService';

export class UploadController {
    private emailService: EmailService;

    constructor() {
        this.emailService = new EmailService();
    }

    public async uploadPDF(req: Request, res: Response): Promise<void> {
        try {
            const file = req.file;
            if (!file) {
                res.status(400).send('No file uploaded.');
                return;
            }

            // Call the method to send email with the PDF attached
            await this.sendEmail(file);
            res.status(200).send('File uploaded and email sent successfully.');
        } catch (error) {
            res.status(500).send('An error occurred while uploading the file.');
        }
    }

    private async sendEmail(file: Express.Multer.File): Promise<void> {
        const emailData = {
            to: 'recipient@example.com', // Replace with actual recipient
            subject: 'Here is your PDF',
            text: 'Please find the attached PDF.',
            attachments: [
                {
                    filename: file.originalname,
                    content: file.buffer,
                },
            ],
        };

        await this.emailService.sendEmail(emailData);
    }
}