import { Model, model, Document, Schema } from 'mongoose';
import { IResponse, InternalError, QueryIdError, QueryFoundError } from '../types';

interface IMatchBase {
    tournament: string,
    players: string[]
    winner: string,
    round: number,
    table: number
}

export interface IMatchSchema extends Document, IMatchBase {
};

export interface IMatch extends IMatchSchema {
};

interface IMatchModel extends Model<IMatch> {
    search: (query: any) => Promise<any>,
    details: (query: any) => Promise<any>
};

export const MatchSchema: Schema<IMatch> = new Schema<IMatch>({
    tournament: { type: String, ref: 'Tournament', required: true },
    players: [{ type: String, ref: 'Player', default: [] }],
    winner: { type: String, ref: 'Player', default: null },
    round: { type: Number },
    table: { type: Number }
}, { timestamps:  true });

MatchSchema.statics.search = function (query: any): Promise<any> {
    return (new Promise((resolve: (matches: IMatch[]) => void, reject: (err: IResponse) => void): void => {
        Match.find(query)
        .populate({
            path: 'tournament',
            select: '-createdAt -updatedAt -__v',
            model: 'Tournament'
        })
        .populate({
            path: 'players',
            select: '-createdAt -updatedAt -__v',
            model: 'Player'
        })
        .populate({
            path: 'winner',
            select: '-createdAt -updatedAt -__v',
            model: 'Player'
        })
        .select('-createdAt -updatedAt -__v')
        .then((matches: IMatch[]): void => {
            if (matches.length > 0) {
                return (resolve(matches));
            } else {
                return (reject(QueryFoundError));
            }
        }).catch((err: any): void => {
            return (reject(InternalError(err)));
        });
    }));
};

MatchSchema.statics.details = function(query: any): Promise<any> {
    return new Promise((resolve: (match: IMatch) => void, reject: (err: IResponse) => void): void => {
        Match.findById(query)
        .populate({
            path: 'tournament',
            select: '-createdAt -updatedAt -__v',
            model: 'Tournament'
        })
        .populate({
            path: 'players',
            select: '-createdAt -updatedAt -__v',
            model: 'Player'
        })
        .populate({
            path: 'winner',
            select: '-createdAt -updatedAt -__v',
            model: 'Player'
        })
        .select('-_id -createdAt -updatedAt -__v')
        .then((match: IMatch | null): void => {
            if (!match) {
                return reject(QueryIdError);
            } else {
                return resolve(match);
            }
        }).catch((err: any): void => {
            return reject(InternalError(err));
        });
    });
};

export const Match: IMatchModel = model<IMatch, IMatchModel>('Match', MatchSchema);