import multer, { Multer } from 'multer';
import { MULTER_PATH } from '../../config';
import { InvalidFile } from '../../recipes/responseRecipe';

export const MulterFileController: Multer = multer({
    storage: multer.diskStorage({
        destination: (req: any, file: any, done: Function) : void => {
            done(null, MULTER_PATH + 'files/');
        },
        filename: (req: any, file: any, done: Function): void => {
            const uniqueSuffix: string = Date.now() + '-'+ Math.round(Math.random() * 1E9);
            done(null, file.fieldname + '-' + uniqueSuffix); 
        }
    }),
    limits: {
        fileSize: 25000000
    },
    fileFilter: (req: any, file: any, done: Function): void => {
        if (!file.originalname.match(/\.(xml)$/)) {
            return done(InvalidFile, false);
        }
        done(null, true);
    }
});