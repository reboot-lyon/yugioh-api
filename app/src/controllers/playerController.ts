import { Request, Response, NextFunction } from 'express';
import { IPlayer, Player } from '../models/playerModel';
import { requestLookUp } from '../utils';
import { IResponse } from '../recipes/responseRecipe';

interface IQuerySearch {
    text: string,
};

export class QuerySearch implements IQuerySearch {

    public text: string = ''

    public validate(): Promise<any> {
        return new Promise((resolve: (mongoQuery: any) => void, reject: (err: any) => void): void => {
            if (!this.isValid()) {
                return reject(undefined);
            } else {
                return resolve({
                    $text: { $search: this.text?.toLowerCase() }
                });
            }
        });
    }

    private isValid(): boolean {
        return (this.text !== '' ? true : false);
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

export class playerController {

    public searchHandler(req: Request, res: Response, next: NextFunction): void {
        Player.search(requestLookUp([req.query], new QuerySearch())).then((data: any): void => {
            res.status(200).json(data);
        }).catch((err: IResponse): void => {
            next(err);
        })
    }

    public detailsHandler(req: Request, res: Response, next: NextFunction): void {
        Player.details(requestLookUp([req.params], new QueryDetails())).then((data: any): void => {
            res.status(200).json(data);
        }).catch((err: IResponse): void => {
            next(err);
        });
    }
};