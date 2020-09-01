import { Response, Request, NextFunction } from 'express';
import { Query } from './mainController';
import { IMatch, Match } from '../models/matchModels';
import { requestLookUp } from '../utils';
import { IResponse } from '../recipes/responseRecipe';

interface IQueryDetails {
    id: string
};

class QueryDetails extends Query implements IQueryDetails {

    public id: string = ''

    public validate(): any {
        if (!this.isValid()) {
            return (undefined);
        } else {
            return ({});
        }
    }

    public response(match: IMatch): any {
        return ({
            players: match.players.map(player => Object.assign({
                id: player._id
            })),
            winner: match.winner?._id
        })
    };

    private isValid(): boolean {
        return (this.id !== '' ? true : false);
    }
}

export class matchController {

    public detailsHandler(req: Request, res: Response, next: NextFunction): void {
        Match.details(requestLookUp([req.params], new QueryDetails())).then((data: any): void => {
            res.status(200).json(data);
        }).catch((err: IResponse): void => {
            next(err);
        });
    }
}