import { Model, model, Document, Schema } from 'mongoose';
import { QueryDetails, QuerySearch } from '../controllers/matchController';
import { IResponse, InternalError, QueryFieldError, QueryValuedError, QueryIdError, QueryFoundError } from '../recipes/responseRecipe';
import { Tournament } from './tournamentModel';
import { Player } from './playerModel';

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
    search: (query: QuerySearch) => Promise<any>,
    details: (query: QueryDetails) => Promise<any>
};

export const MatchSchema: Schema<IMatch> = new Schema<IMatch>({
    tournament: { type: String, ref: 'Tournament', required: true },
    players: [{ type: String, ref: 'Player', default: [] }],
    winner: { type: String, ref: 'Player', default: null },
    round: { type: Number },
    table: { type: Number }
}, { timestamps:  true });

MatchSchema.statics.search = function (query: QuerySearch): Promise<any> {
    return (new Promise((resolve: (matches: IMatch[]) => void, reject: (err: IResponse) => void): void => {
        if (!query) {
            return (reject(QueryFieldError));
        } else {
            query.validate().then((mongoQuery: any): void => {
                Match.find(mongoQuery)
                .populate('tournament', '-createdAt -updatedAt -__v', Tournament)
                .populate('players', '-createdAt -updatedAt -__v', Player)
                .populate('winner', '-createdAt -updatedAt -__v', Player)
                .select('-createdAt -updatedAt -__v').then((matches: IMatch[]): void => {
                    if (matches.length > 0) {
                        return (resolve(matches));
                    } else {
                        return (reject(QueryFoundError));
                    }
                }).catch((err: any): void => {
                    return (reject(InternalError(err)));
                });
            }).catch((err: any): void => {
                return (reject(InternalError(err)));
            });
        }
    }));
};

MatchSchema.statics.details = function(query: QueryDetails): Promise<any> {
    return new Promise((resolve: (match: IMatch) => void, reject: (err: IResponse) => void): void => {
        if (!query) {
            return reject(QueryFieldError);
        } else {
            query.validate().then((mongoQuery: any): void => {
                Match.findById(mongoQuery).populate('tournament players winner').select('tournament players winner -_id').then((match: IMatch | null): void => {
                    if (!match) {
                        return reject(QueryIdError);
                    } else {
                        return resolve(match);
                    }
                }).catch((err: any): void => {
                    console.log(err);
                    return reject(InternalError(err));
                });
            }).catch((): void => {
                return reject(QueryValuedError);
            });
        }
    });
};

export const Match: IMatchModel = model<IMatch, IMatchModel>('Match', MatchSchema);