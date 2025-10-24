import express from 'express';
import { json } from 'body-parser';
import { setUploadRoutes } from './routes/uploadRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(json());

// Routes
setUploadRoutes(app);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});