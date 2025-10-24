export default {
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: Number(process.env.SMTP_PORT) || 587,
  user: process.env.SMTP_USER || 'user@example.com',
  pass: process.env.SMTP_PASS || 'password',
  secure: process.env.SMTP_SECURE === 'true' || false,
};