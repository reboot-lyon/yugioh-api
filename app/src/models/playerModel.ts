import { Model, model, Document, Schema } from 'mongoose';
import { Query } from '../controllers/mainController';
import { IMatchSchema, MatchSchema } from './matchModels';
import { IResponse, InternalError, QueryFieldError, QueryValuedError, QueryIdError } from '../recipes/responseRecipe';

interface IPlayerBase {
    yugioh_id: string,
    firstName: string,
    lastName: string,
    nickname: string,
    rank: number,
    avatar: string,
    matchs: IMatchSchema[]
}

export interface IPlayerSchema extends Document, IPlayerBase {
};

export interface IPlayer extends IPlayerSchema {
};

interface IPlayerModel extends Model<IPlayer> {
    search: (query: Query) => Promise<any>,
    details: (query: Query) => Promise<any>
};

export const PlayerSchema: Schema<IPlayer> = new Schema<IPlayer>({
    yugioh_id: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    nickname: { type: String },
    rank: { type: Number },
    avatar: { type: String },
    matchs: { type: [MatchSchema], default: [] }
}, { timestamps:  true }).index({ yugioh_id: 'text', firstName: 'text', lastName: 'text', nickname: 'text' });

PlayerSchema.statics.search = function(query: Query): Promise<any> {
    return new Promise((resolve: (tournaments: any) => void, reject: (err: IResponse) => void): void => {
        if (!query) {
            return reject(QueryFieldError);
        } else {
            const mongoQuery: any = query.validate();
            if (!mongoQuery) {
                return reject(QueryValuedError);
            } else {
                Player.find(mongoQuery).then((players: IPlayer[]): void => {
                    return resolve(query.response(players));
                }).catch((err: any): void => {
                        return reject(InternalError);
                });
            }
        }
    });
};

PlayerSchema.statics.details = function(query: Query): Promise<any> {
    return new Promise((resolve: (tournament: any) => void, reject: (err: IResponse) => void): void => {
        if (!query) {
            return reject(QueryFieldError);
        } else {
            const mongoQuery: any = query.validate();
            if (!mongoQuery) {
                return reject(QueryValuedError);
            } else {
                Player.findOne(mongoQuery).then((player: IPlayer | null): void => {
                    if (!player) {
                        return reject(QueryIdError);
                    } else {
                        return resolve(query.response(player));
                    }
                }).catch((err: any): void => {
                    return reject(InternalError);
                });
            }
        }
    });
};

export const Player: IPlayerModel = model<IPlayer, IPlayerModel>('Player', PlayerSchema);