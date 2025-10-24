import request from 'supertest';
import app from '../src/app'; // Ajuste o caminho conforme necessário

describe('Upload and Email Tests', () => {
  it('should upload a PDF file and send an email', async () => {
    const response = await request(app)
      .post('/upload') // Ajuste a rota conforme necessário
      .attach('file', 'path/to/test.pdf'); // Substitua pelo caminho do arquivo PDF de teste

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('PDF uploaded and email sent successfully');
  });

  it('should return an error for non-PDF files', async () => {
    const response = await request(app)
      .post('/upload') // Ajuste a rota conforme necessário
      .attach('file', 'path/to/test.txt'); // Substitua pelo caminho do arquivo de texto de teste

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Only PDF files are allowed');
  });
});