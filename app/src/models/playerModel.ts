import { Model, model, Document, Schema } from 'mongoose';
import { QueryDetails, QuerySearch } from '../controllers/playerController';
import { IResponse, InternalError, QueryFieldError, QueryValuedError, QueryIdError } from '../recipes/responseRecipe';

interface IPlayerBase {
    firstname: string,
    lastname: string,
    nickname: string,
    rank: number,
    avatar: string
}

export interface IPlayerSchema extends Document, IPlayerBase {
};

export interface IPlayer extends IPlayerSchema {
};

interface IPlayerModel extends Model<IPlayer> {
    search: (query: QuerySearch) => Promise<any>,
    details: (query: QueryDetails) => Promise<any>
};

export const PlayerSchema: Schema<IPlayer> = new Schema<IPlayer>({
    _id: { type: String, required: true },
    firstname: { type: String },
    lastname: { type: String },
    nickname: { type: String },
    rank: { type: Number },
    avatar: { type: String }
}, { timestamps:  true, _id: false  }).index({ _id: 'text', firstname: 'text', lastname: 'text', nickname: 'text' });

PlayerSchema.statics.search = function(query: QuerySearch): Promise<any> {
    return new Promise((resolve: (players: IPlayer[]) => void, reject: (err: IResponse) => void): void => {
        if (!query) {
            return reject(QueryFieldError);
        } else {
            query.validate().then((mongoQuery: any): void => {
                Player.find(mongoQuery).select('nickame avatar').then((players: IPlayer[]): void => {
                    return resolve(players);
                }).catch((err: any): void => {
                        return reject(InternalError);
                });
            }).catch((): void => {
                return reject(QueryValuedError);
            });
        }
    });
};

PlayerSchema.statics.details = function(query: QueryDetails): Promise<any> {
    return new Promise((resolve: (player: IPlayer) => void, reject: (err: IResponse) => void): void => {
        if (!query) {
            return reject(QueryFieldError);
        } else {
            query.validate().then((mongoQuery: any): void => {
                Player.findById(mongoQuery).select('firstname lastname nickname rank avatar matchs -_id').then((player: IPlayer | null): void => {
                    if (!player) {
                        return reject(QueryIdError);
                    } else {
                        return resolve(player);
                    }
                }).catch((err: any): void => {
                    return reject(InternalError);
                });
            }).catch((): void => {
                return reject(QueryValuedError);
            });
        }
    });
};

export const Player: IPlayerModel = model<IPlayer, IPlayerModel>('Player', PlayerSchema);