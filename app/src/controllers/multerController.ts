import multer, { Multer } from 'multer';
import { MULTER_PATH } from '../config';
import { QueryFileError } from '../types';

export const MulterFileController: Multer = multer({
    storage: multer.diskStorage({
        destination: (req: any, file: any, done: Function) : void => {
            done(null, MULTER_PATH + 'media/');
        },
        filename: (req: any, file: any, done: Function): void => {
            const uniqueSuffix: string = Date.now() + '-'+ Math.round(Math.random() * 1E9);
            done(null, file.fieldname + '-' + uniqueSuffix); 
        }
    }),
    limits: {
        fileSize: 25000000
    },
    fileFilter: (req: any, file: Express.Multer.File, done: Function): void => {
        if (!file.originalname.match(/\.(Tournament)$/)) {
            return done(QueryFileError, false);
        }
        done(null, true);
    }
});

export const MulterController: Multer = multer();