export const MONGODB_URI: string = process.env.MONGODB_URI || 'mongodb://localhost:27017/api';
export const SECRET: string = process.env.SECRET || 'secret';
export const MULTER_PATH: string = process.env.MULTER_PATH || 'public/';
export const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
export const HOST: string = process.env.URL || '127.0.0.1';