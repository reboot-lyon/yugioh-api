import { Model, model, Document, Schema } from 'mongoose';
import { Query } from '../controllers/mainController';
import { IResponse, InternalError, QueryFieldError, QueryValuedError, QueryIdError } from '../recipes/responseRecipe';
import { IMatchSchema, MatchSchema } from './matchModels';

interface ITournamentBase {
    yugioh_id: string,
    name: string,
    date: Date,
    rounds: number,
    file: string,
    matchs: IMatchSchema[]
}

export interface ITournamentSchema extends Document, ITournamentBase {
};

export interface ITournament extends ITournamentSchema {
};

interface ITournamentModel extends Model<ITournament> {
    search: (query: Query) => Promise<any>,
    details: (query: Query) => Promise<any>,
    register: (query: Query) => Promise<any>,
};

export const TournamentSchema: Schema<ITournament> = new Schema<ITournament>({
    yugioh_id: { type: String, required: true },
    name: { type: String },
    date: { type: Date },
    rounds: { type: Number },
    file: { type: String },
    matchs: { type: [MatchSchema], default: [] }
}, { timestamps:  true }).index({ yugioh_id: 'text', name: 'text' });

TournamentSchema.statics.search = function(query: Query): Promise<any> {
    return new Promise((resolve: (tournaments: any) => void, reject: (err: IResponse) => void): void => {
        if (!query) {
            return reject(QueryFieldError);
        } else {
            const mongoQuery: any = query.validate();
            if (!mongoQuery) {
                return reject(QueryValuedError);
            } else {
                Tournament.find(mongoQuery).then((tournaments: ITournament[]): void => {
                    return resolve(query.response(tournaments));
                }).catch((err: any): void => {
                        return reject(InternalError);
                });
            }
        }
    });
};

TournamentSchema.statics.details = function(query: Query): Promise<any> {
    return new Promise((resolve: (tournament: any) => void, reject: (err: IResponse) => void): void => {
        if (!query) {
            return reject(QueryFieldError);
        } else {
            const mongoQuery: any = query.validate();
            if (!mongoQuery) {
                return reject(QueryValuedError);
            } else {
                Tournament.findOne(mongoQuery).then((tournament: ITournament | null): void => {
                    if (!tournament) {
                        return reject(QueryIdError);
                    } else {
                        return resolve(query.response(tournament));
                    }
                }).catch((err: any): void => {
                    return reject(InternalError);
                });
            }
        }
    });
};

TournamentSchema.statics.register = function(query: Query): Promise<any> {
    return new Promise((resolve: (tournament: any) => void, reject: (err: IResponse) => void): void => {
        if (!query) {
            return reject(QueryFieldError);
        } else {
            const mongoQuery: any = query.validate();
            if (!mongoQuery) {
                return reject(QueryValuedError);
            } else {
                new Tournament(mongoQuery).save().then((tournament: ITournament): void => {
                    return resolve(query.response(tournament));
                }).catch((err: any): void => {
                        return reject(InternalError);
                });
            }
        }
    });
};

export const Tournament: ITournamentModel = model<ITournament, ITournamentModel>('Tournament', TournamentSchema);