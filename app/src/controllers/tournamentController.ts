import { Request, Response, NextFunction } from 'express';
import { ITournament, Tournament } from '../models/tournamentModel';
import { Query } from './mainController';
import { IResponse } from '../recipes/responseRecipe';
import { requestLookUp } from '../utils';
import { Parser } from 'xml2js';
import fs from 'fs';

interface IQuerySearch {
    text: string,
    date?: string
};

class QuerySearch extends Query implements IQuerySearch {

    public text: string = ''
    public date?: string = undefined

    public validate(): any {
        if (!this.isValid()) {
            return (undefined);
        } else {
            return ({});
        }
    }

    public response(tournament: ITournament): any {
        return ({
            id: tournament._id,
            name: tournament.name,
            date: tournament.date
        })
    };

    private isValid(): boolean {
        return ((this.date && (this.date === ''))
        ? false : true)
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

    public response(tournaments: ITournament[]): any {
        return (tournaments.map(tournament => Object.assign({
            id: tournament._id,
            name: tournament.name,
            date: tournament.date,
            rounds: tournament.rounds,
            file: tournament.file,
            matchs: tournament.matchs.map(match => Object.assign({
                id: match._id,
                players: match.players.map(player => Object.assign({
                    id: player._id
                })),
                winner: match.winner?._id
            }))
        })))
    }

    private isValid(): boolean {
        return (this.id !== '' ? true : false);
    }
};

interface IQueryRegister {
    files: any[]
};

class QueryRegister extends Query implements IQueryRegister  {

    files: any[] = []

    public validate(): any {
        if (!this.isValid()) {
            return (undefined);
        } else {
            return ({});
        }
    }

    public response(tournament: ITournament): any {
        return ({
            id: tournament._id
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
        Tournament.register(requestLookUp([], new QueryRegister())).then((data: any): void => {
            res.status(200).json(data);
        }).catch((err: IResponse): void => {
            next(err);
        });
        const files: any = req.files;
        const lst: any[] = [];
        for (let file of files.files) {
            fs.readFile(file.path, (err: any, data: Buffer): void => {
                if (err) {
                    next(err);
                } else {
                    new Parser().parseString(data, (err: any, parsed: any): void => {
                        if (err) {
                            next(err)
                        } else {
                            lst.push(parsed);
                        }
                    });
                }
            });
        }
        console.log(lst);
        res.status(200).json(lst);
    }
}
