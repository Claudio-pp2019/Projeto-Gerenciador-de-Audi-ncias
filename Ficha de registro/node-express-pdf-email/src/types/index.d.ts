interface UploadRequest extends Express.Request {
    file: Express.Multer.File;
}

interface EmailData {
    to: string;
    subject: string;
    text: string;
    attachments: {
        filename: string;
        path: string;
    }[];
}

export { UploadRequest, EmailData };