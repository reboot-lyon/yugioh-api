import { Response, Request, NextFunction } from 'express';
import { Match } from '../models/matchModels';
import { handShake, recipLookUp } from '../utils';
import { IResponse } from '../types';

export class QuerySearch {

    public tournament?: string = undefined
    public players?: string[] = undefined
    public winner?: string = undefined

    public validate(): Promise<any> {
        return (new Promise((resolve: (query: any) => void, reject: (err: any) => void): void => {
            recipLookUp(this.validator(), this).then((): void => {
                const query: any = {};
                if (this.tournament) query.tournament = this.tournament;
                if (this.players) query.players = { $in: this.players };
                if (this.winner) query.winner = this.winner;
                return resolve(query);
            }).catch((err: IResponse): void => {
                return (reject(err));
            });
        }));
    }

    private validator(): any {
        return ({
            tournament: (tournament: string) => tournament !== '' ? true : false,
            players: (players: string[]) => players.length > 0 ? true : false,
            winner: (winner: string) => winner !== '' ? true : false,
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

export class matchController {

    public searchHandler(req: Request, res: Response, next: NextFunction): void {
        handShake([req.query], new QuerySearch()).then((recip: any): void => {
            Match.search(recip).then((data: any): void => {
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
            Match.details(recip).then((data: any): void => {
                res.status(200).json(data);
            }).catch((err: IResponse): void => {
                next(err);
            });
        }).catch((err: IResponse): void => {
            next(err);
        });
    }
}