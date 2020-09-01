import { Request, Response, NextFunction } from 'express';
import { Query } from './mainController';
import { IPlayer, Player } from '../models/playerModel';
import { requestLookUp } from '../utils';
import { IResponse } from '../recipes/responseRecipe';

interface IQuerySearch {
    text: string,
};

class QuerSearch extends Query implements IQuerySearch {

    public text: string = ''

    public validate(): any {
        if (!this.isValid()) {
            return (undefined);
        } else {
            return ({});
        }
    }

    public response(players: IPlayer[]): any {
        return (players.map(player => Object.assign({
            id: player.id,
            avatar: player.avatar,
            nickname: player.nickname,
        })));
    }

    private isValid(): boolean {
        return (this.text !== '' ? true : false);
    }
};

interface IQueryDetails {
    id: string
};

class QueryDetails extends Query implements IQueryDetails {

    id: string = ''

    public validate(): any {
        if (!this.isValid()) {
            return (undefined);
        } else {
            return ({});
        }
    }

    public response(player: IPlayer): any {
        return ({
            yugioh_id: player.yugioh_id,
            firstname: player.firstName,
            lastname: player.lastName,
            nickname: player.nickname,
            rank: player.rank,
            avatar: player.avatar,
            matchs: player.matchs.map(match => Object.assign({
                id: match._id
            }))
        })
    }

    private isValid(): boolean {
        return (this.id !== '' ? true : false);
    }
};

export class playerController {

    public searchHandler(req: Request, res: Response, next: NextFunction): void {
        Player.search(requestLookUp([req.query], new QuerSearch())).then((data: any): void => {
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