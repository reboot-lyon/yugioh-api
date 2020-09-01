import { Model, model, Document, Schema } from 'mongoose';
import { Query } from '../controllers/mainController';
import { IPlayerSchema, PlayerSchema, Player } from './playerModel'
import { IResponse, InternalError, QueryFieldError, QueryValuedError, QueryIdError } from '../recipes/responseRecipe';

interface IMatchBase {
    tournament_id: string,
    players: IPlayerSchema[]
    winner: IPlayerSchema,
}

export interface IMatchSchema extends Document, IMatchBase {
};

export interface IMatch extends IMatchSchema {
};

interface IMatchModel extends Model<IMatch> {
    details: (query: Query) => Promise<any>
};

export const MatchSchema: Schema<IMatch> = new Schema<IMatch>({
    tournament_id: { type: String },
    players: { type: [PlayerSchema], default: [] },
    winner: { type: PlayerSchema }
}, { timestamps:  true });

MatchSchema.statics.details = function(query: Query): Promise<any> {
    return new Promise((resolve: (tournament: any) => void, reject: (err: IResponse) => void): void => {
        if (!query) {
            return reject(QueryFieldError);
        } else {
            const mongoQuery: any = query.validate();
            if (!mongoQuery) {
                return reject(QueryValuedError);
            } else {
                Match.findOne(mongoQuery).then((match: IMatch | null): void => {
                    if (!match) {
                        return reject(QueryIdError);
                    } else {
                        return resolve(query.response(match));
                    }
                }).catch((err: any): void => {
                    return reject(InternalError);
                });
            }
        }
    });
};

export const Match: IMatchModel = model<IMatch, IMatchModel>('Match', MatchSchema);