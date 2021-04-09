import { Request, Response, NextFunction } from 'express';
import { Player } from '../models/playerModel';
import { recipLookUp, handShake } from '../utils';
import { IResponse } from '../types';

export class QuerySearch {

    public text?: string = undefined
    public page?: number = undefined
    public size?: number = undefined

    public validate(): Promise<any> {
        return (new Promise((resolve: (query: any) => void, reject: (err: any) => void): void => {
            recipLookUp(this.validator(), this).then((): void => {
                const query: any = {
                    mongo: {},
                    sort: {},
                    page: this.page || 0,
                    size: this.size || 100
                };
                if (this.text) {
                    query.mongo.$text = { $search: this.text.toLowerCase() };
                    query.sort = { score: { $meta: "textScore" } };
                }
                return (resolve(query));
            }).catch((err: IResponse): void => {
                return (reject(err));
            });
        }));
    }

    private validator(): any {
        return ({
            text: (text: string) => text !== '' ? true : false
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

export class playerController {

    public searchHandler(req: Request, res: Response, next: NextFunction): void {
        handShake([req.query], new QuerySearch()).then((recip: any): void => {
            Player.search(recip).then((data: any): void => {
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
            Player.details(recip).then((data: any): void => {
                res.status(200).json(data);
            }).catch((err: IResponse): void => {
                next(err);
            });
        }).catch((err: IResponse): void => {
            next(err);
        });
    }
};