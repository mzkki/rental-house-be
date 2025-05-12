import dotenv from 'dotenv';

dotenv.config();

interface AppConfig {
  port: number;
  env: string;
  jwtSecret: string;
}

const appConfig: AppConfig = {
  port: parseInt(process.env.APP_PORT || '3000', 10),
  env: process.env.APP_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
};

export default appConfig;
