import { Router } from 'express';
import { UploadController } from '../controllers/uploadController';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();
const uploadController = new UploadController();

export const setUploadRoutes = () => {
    router.post('/upload', upload.single('pdf'), uploadController.uploadPDF.bind(uploadController));
    router.post('/send-email', uploadController.sendEmail.bind(uploadController));
    return router;
};