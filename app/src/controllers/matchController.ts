import { Response, Request, NextFunction } from 'express';
import { Match } from '../models/matchModels';
import { requestLookUp } from '../utils';
import { IResponse } from '../recipes/responseRecipe';

interface IQuerySearch {
    tournament?: string,
    players?: string[],
    winner?: string
};

export class QuerySearch implements IQuerySearch {

    public tournament?: string = undefined
    public players?: string[] = undefined
    public winner?: string = undefined

    public validate(): Promise<any> {
        return (new Promise((resolve: (mongoQuery: any) => void, reject: () => void): void => {
            if (!this.isValid()) {
                return (reject());
            } else {
                const mongoQuery: any = {};
                if (this.tournament) mongoQuery.tournament = this.tournament;
                if (this.players) mongoQuery.players = { $in: this.players };
                if (this.winner) mongoQuery.winner = this.winner;
                return resolve(mongoQuery);
            }
        }));
    }

    private isValid(): boolean {
        return ((this.tournament && (this.tournament === ''))
        || (this.players && (this.players === []))
        || (this.winner && (this.winner === ''))
        ? false : true);
    }
}

interface IQueryDetails {
    id: string
};

export class QueryDetails implements IQueryDetails {

    public id: string = ''

    public validate(): Promise<any> {
        return (new Promise((resolve: (mongoQuery: any) => void, reject: (err: any) => void): void => {
            if (!this.isValid()) {
                return (reject(undefined));
            } else {
                return (resolve(this.id));
            }
        }));
    }

    private isValid(): boolean {
        return (this.id !== '' ? true : false);
    }
}

export class matchController {

    public searchHandler(req: Request, res: Response, next: NextFunction): void {
        Match.search(requestLookUp([req.query], new QuerySearch())).then((data: any): void => {
            res.status(200).json(data);
        }).catch((err: IResponse): void => {
            next(err);
        });
    }

    public detailsHandler(req: Request, res: Response, next: NextFunction): void {
        Match.details(requestLookUp([req.params], new QueryDetails())).then((data: any): void => {
            res.status(200).json(data);
        }).catch((err: IResponse): void => {
            next(err);
        });
    }
}