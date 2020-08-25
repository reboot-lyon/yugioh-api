import { Request, Response, NextFunction } from 'express';
import { Parser } from 'xml2js';
import fs from 'fs';

export class TournamentController {

    public registerHandler(req: Request, res: Response, next: NextFunction) {
        console.log(req.body, req.files, req.file);
        fs.readFile(req.file.path, (err: any, data: Buffer): void => {
            if (err) {
                next(err);
            } else {
                new Parser().parseString(data, (err: any, parsed: any): void => {
                    if (err) {
                        next(err)
                    } else {
                        res.status(200).json(parsed);
                    }
                });
            }
        });
    }
}
