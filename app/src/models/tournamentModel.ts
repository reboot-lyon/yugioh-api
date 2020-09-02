import { Model, model, Document, Schema } from 'mongoose';
import { IResponse, InternalError, QueryFieldError, QueryValuedError, QueryIdError, QueryFoundError } from '../recipes/responseRecipe';
import { QueryRegister, QuerySearch, QueryDetails } from '../controllers/tournamentController';
import { Player, IPlayer } from './playerModel';
import { Match } from './matchModels';
import util from 'util';

interface ITournamentBase {
    name: string,
    date: Date,
    rounds: number,
    file: string
}

export interface ITournamentSchema extends Document, ITournamentBase {
};

export interface ITournament extends ITournamentSchema {
};

interface ITournamentModel extends Model<ITournament> {
    search: (query: QuerySearch) => Promise<any>,
    details: (query: QueryDetails) => Promise<any>,
    register: (query: QueryRegister) => Promise<any>,
};

export const TournamentSchema: Schema<ITournament> = new Schema<ITournament>({
    _id: { type: String, required: true },
    name: { type: String },
    date: { type: Date },
    rounds: { type: Number },
    file: { type: String, required: true }
}, { timestamps:  true, _id: false }).index({ _id: 'text', name: 'text' });

TournamentSchema.statics.search = function(query: QuerySearch): Promise<any> {
    return new Promise((resolve: (tournaments: ITournament[]) => void, reject: (err: IResponse) => void): void => {
        if (!query) {
            return reject(QueryFieldError);
        } else {
            query.validate().then((mongoQuery: any): void => {
                Tournament.find(mongoQuery).select('_id name date').then((tournaments: ITournament[]): void => {
                    return resolve(tournaments);
                }).catch((err: any): void => {
                        return reject(InternalError);
                });
            }).catch((): void => {
                return reject(QueryValuedError);
            });
        }
    });
};

TournamentSchema.statics.details = function(query: QueryDetails): Promise<any> {
    return new Promise((resolve: (tournament: ITournament) => void, reject: (err: IResponse) => void): void => {
        if (!query) {
            return reject(QueryFieldError);
        } else {
            query.validate().then((mongoQuery: any): void => {
                Tournament.findById(mongoQuery).select('name date rounds file matchs -_id').then((tournament: ITournament | null): void => {
                    if (!tournament) {
                        return reject(QueryIdError);
                    } else {
                        return resolve(tournament);
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

TournamentSchema.statics.register = function(query: QueryRegister): Promise<any> {
    return new Promise((resolve: (tournament: any) => void, reject: (err: IResponse) => void): void => {
        if (!query) {
            return reject(QueryFieldError);
        } else {
            query.validate().then((files: any): void => {
                for (let file of files) {
                    console.log(util.inspect(file, true, null));
                    Tournament.find({ _id: file.tournament.id }).then((tournamentsFind: ITournament[]): void => {
                        if (tournamentsFind.length > 0) {
                            return reject(QueryFoundError);
                        } else {
                            new Tournament({
                                _id: file.tournament.id,
                                name: file.tournament.name,
                                date: new Date(file.tournament.date),
                                rounds: file.tournament.currentround,
                                file: query.files[files.indexOf(file)].path
                            }).save().then((tournament: ITournament): void => {
                                for (let tournPlayer of file.tournament.tournamentplayers.tournplayer) {
                                    Player.findById(tournPlayer.player.id).then((player: IPlayer | null): void => {
                                        if (!player) {
                                            new Player({
                                                _id: tournPlayer.player.id,
                                                firstname: tournPlayer.player.firstname,
                                                lastname: tournPlayer.player.lastname,
                                                nickname: '',
                                                rank: -1,
                                                avatar: ''
                                            }).save().catch((): void => {
                                                return (reject(InternalError));
                                            });
                                        }
                                    });
                                }
                                for (let tournMatch of file.tournament.matches.tournmatch) {
                                    new Match({
                                        tournament: tournament._id,
                                        players: [tournMatch.player[0], tournMatch.player[1]],
                                        winner: '0' + tournMatch.winner,
                                        round: tournMatch.round,
                                        table: tournMatch.table
                                    }).save().catch((): void => {
                                        return reject(InternalError);
                                    })
                                }
                                return resolve({
                                    id: tournament._id
                                });
                            }).catch((err: any): void => {
                                return reject(InternalError);
                            });
                        }
                    })
                }
            }).catch((): void => {
                return reject(QueryValuedError);
            });
        }
    });
};

export const Tournament: ITournamentModel = model<ITournament, ITournamentModel>('Tournament', TournamentSchema);