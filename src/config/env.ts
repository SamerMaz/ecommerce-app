import dotenv from 'dotenv';

dotenv.config();

export const config = {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY!,
};
