import { Request, Response, NextFunction } from 'express';
import { Tournament } from '../models/tournamentModel';
import { InternalError, IResponse } from '../types';
import { handShake, recipLookUp } from '../utils';
import { HOST, PORT } from '../config';
import { Parser } from 'xml2js';
import fs from 'fs';

export class QuerySearch {

    public text?: string = undefined
    public date?: string = undefined

    public validate(): Promise<any> {
        return (new Promise((resolve: (query: any) => void, reject: (err: any) => void): void => {
            recipLookUp(this.validator(), this).then((): void => {
                const query: any = {};
                if (this.text) query.$text = { $search: this.text?.toLowerCase() };
                if (this.date) query.date = new Date(this.date);
                return (resolve(query));
            }).catch((err: IResponse): void => {
                return (reject(err));
            });
        }));
    }

    private validator(): any {
        return ({
            text: (text: string) => text !== '' ? true : false,
            date: (date: string) => date !== '' ? true : false
        });
    }
};

export class QueryId {
    public id: string = ''

    public validate(): Promise<any> {
        return (new Promise((resolve: (query: any) => void, reject: (err: IResponse) => void): void => {
            recipLookUp(this.validator(), this).then((): void => {
                return (resolve(this.id));
            }).catch((err: IResponse): void => {
                return (reject(err));
            });
        }))
    }

    private validator(): any {
        return ({
            id: (id: string) => id !== '' ? true : false
        });
    }
};

export class QueryRegister {

    files: any[] = []

    public validate(): Promise<any> {
        return (new Promise((resolve: (files: any) => void, reject: (err: any) => void): void => {
            recipLookUp(this.validator(), this).then((): void => {
                const parser: Parser = new Parser({ explicitArray: false, normalizeTags: true });
                const tasks: Promise<any>[] = [];
                for (let file of this.files) {
                    const data: Buffer = fs.readFileSync(file.path);
                    tasks.push(parser.parseStringPromise(data));
                }
                Promise.all(tasks).then((files: any[]): void => {
                    return (resolve(files.map((file, i) => file = {
                        name: `http://${HOST}:${PORT}/static/media/` + this.files[i].filename,
                        file: file
                    })));
                }).catch((err: any): void => {
                    return (reject(InternalError(err)));
                });
            }).catch((err: IResponse): void => {
                return (reject(err));
            });
        }));
    }

    private validator(): any {
        return ({
            files: (files: any[]) => files.length > 0 ? true : false,
        });
    }
};

export class TournamentController {

    public searchHandler(req: Request, res: Response, next: NextFunction): void {
        handShake([req.query], new QuerySearch()).then((recip: any): void => {
            Tournament.search(recip).then((data: any): void => {
                res.status(200).json(data);
            }).catch((err: IResponse): void => {
                next(err);
            });
        }).catch((err: IResponse): void => {
            next(err);
        });
    }

    public detailsHandler(req: Request, res: Response, next: NextFunction): void {
        handShake([req.params], new QueryId()).then((recip: any): void => {
            Tournament.details(recip).then((data: any): void => {
                res.status(200).json(data);
            }).catch((err: IResponse): void => {
                next(err);
            });
        }).catch((err: IResponse): void => {
            next(err);
        });
    }

    public registerHandler(req: Request, res: Response, next: NextFunction): void {
        handShake([req.files], new QueryRegister()).then((recip: any): void => {
            Tournament.register(recip).then((data: any): void => {
                res.status(200).json(data);
            }).catch((err: IResponse): void => {
                next(err);
            });
        }).catch((err: IResponse): void => {
            next(err);
        });
    }

    public destroyHandler(req: Request, res: Response, next: NextFunction): void {
        handShake([req.params], new QueryId()).then((recip: any): void => {
            Tournament.destroy(recip).then((data: any): void => {
                res.status(200).json(data);
            }).catch((err: IResponse): void => {
                next(err);
            });
        }).catch((err: IResponse): void => {
            next(err);
        });
    }
}
