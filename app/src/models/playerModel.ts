import { Model, model, Document, Schema } from 'mongoose';
import { IResponse, InternalError, QueryIdError } from '../types';

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
    search: (query: any) => Promise<any>,
    details: (query: any) => Promise<any>
};

export const PlayerSchema: Schema<IPlayer> = new Schema<IPlayer>({
    _id: { type: String, required: true },
    firstname: { type: String },
    lastname: { type: String },
    nickname: { type: String },
    rank: { type: Number },
    avatar: { type: String }
}, { timestamps:  true, _id: false  }).index({ _id: 'text', firstname: 'text', lastname: 'text', nickname: 'text' });

PlayerSchema.statics.search = function(query: any): Promise<any> {
    return new Promise((resolve: (players: IPlayer[]) => void, reject: (err: IResponse) => void): void => {
        Player.find(query)
        .select('-createdAt -updatedAt -__v')
        .then((players: IPlayer[]): void => {
            return resolve(players);
        }).catch((err: any): void => {
                return reject(InternalError(err));
        });
    });
};

PlayerSchema.statics.details = function(query: any): Promise<any> {
    return new Promise((resolve: (player: IPlayer) => void, reject: (err: IResponse) => void): void => {
        Player.findById(query)
        .select('-_id -createdAt -updatedAt -__v')
        .then((player: IPlayer | null): void => {
            if (!player) {
                return reject(QueryIdError);
            } else {
                return resolve(player);
            }
        }).catch((err: any): void => {
            return reject(InternalError(err));
        });
    });
};

export const Player: IPlayerModel = model<IPlayer, IPlayerModel>('Player', PlayerSchema);