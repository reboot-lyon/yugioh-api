import { Request, Response, NextFunction } from 'express';
import { Tournament } from '../models/tournamentModel';
import { IResponse } from '../recipes/responseRecipe';
import { requestLookUp } from '../utils';
import { Parser } from 'xml2js';
import fs from 'fs';

interface IQuerySearch {
    text: string,
    date?: string
};

export class QuerySearch implements IQuerySearch {

    public text: string = ''
    public date?: string = undefined

    public validate(): Promise<any> {
        return new Promise((resolve: (mongoQuery: any) => void, reject: (err: any) => void): void => {
            if (!this.isValid()) {
                return reject(undefined);
            } else {
                const query: any = {
                    $text: { $search: this.text?.toLowerCase() }
                };
                if (this.date) {
                    query.date = new Date(this.date);
                }
                return resolve(query);
            }
        });
    }

    private isValid(): boolean {
        return ((this.date && (this.date === ''))
        ? false : true)
    }
};

interface IQueryDetails {
    id: string
};

export class QueryDetails implements IQueryDetails {

    id: string = ''

    public validate(): Promise<any> {
        return new Promise((resolve: (mongoQuery: any) => void, reject: (err: any) => void): void => {
            if (!this.isValid()) {
                return reject(undefined);
            } else {
                return resolve(this.id);
            }
        });
    }

    private isValid(): boolean {
        return (this.id !== '' ? true : false);
    }
};

interface IQueryRegister {
    files: any[]
};

export class QueryRegister implements IQueryRegister  {

    files: any[] = []

    public validate(): Promise<any> {
        return new Promise((resolve: (files: any) => void, reject: (err: any) => void): void => {
            if (!this.isValid()) {
                return reject(undefined);
            } else {
                const parser: Parser = new Parser({ explicitArray: false, normalizeTags: true });
                const promises: Promise<any>[] = [];
                for (let file of this.files) {
                    const data: Buffer = fs.readFileSync(file.path);
                    promises.push(parser.parseStringPromise(data));
                }
                Promise.all(promises).then((data: any): void => {
                    return resolve(data);
                }).catch((err: any): void => {
                    return reject(undefined);
                });
            }
        });
    }

    private isValid(): boolean {
        return (this.files.length > 0 ?  true : false);
    }
};

export class TournamentController {

    public searchHandler(req: Request, res: Response, next: NextFunction): void {
        Tournament.search(requestLookUp([req.query], new QuerySearch())).then((data: any): void => {
            res.status(200).json(data);
        }).catch((err: IResponse): void => {
            next(err);
        })
    }

    public detailsHandler(req: Request, res: Response, next: NextFunction): void {
        Tournament.details(requestLookUp([req.params], new QueryDetails())).then((data: any): void => {
            res.status(200).json(data);
        }).catch((err: IResponse): void => {
            next(err);
        });
    }

    public registerHandler(req: Request, res: Response, next: NextFunction): void {
        Tournament.register(requestLookUp([req.files], new QueryRegister())).then((data: any): void => {
            res.status(200).json(data);
        }).catch((err: IResponse): void => {
            next(err);
        });
    }
}
