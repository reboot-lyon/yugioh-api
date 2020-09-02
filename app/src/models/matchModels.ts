import { Model, model, Document, Schema } from 'mongoose';
import { QueryDetails } from '../controllers/matchController';
import { IResponse, InternalError, QueryFieldError, QueryValuedError, QueryIdError } from '../recipes/responseRecipe';

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
    details: (query: QueryDetails) => Promise<any>
};

export const MatchSchema: Schema<IMatch> = new Schema<IMatch>({
    tournament: { type: String, ref: 'Tournament', required: true },
    players: { type: [String], ref: 'Player', default: [] },
    winner: { type: String, ref: 'Player', default: null },
    round: { type: Number },
    table: { type: Number }
}, { timestamps:  true });

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
                    return reject(InternalError);
                });
            }).catch((): void => {
                return reject(QueryValuedError);
            });
        }
    });
};

export const Match: IMatchModel = model<IMatch, IMatchModel>('Match', MatchSchema);