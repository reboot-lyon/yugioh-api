import { Model, model, Document, Schema } from 'mongoose';
import { IResponse, InternalError, QueryIdError, QueryFoundError } from '../types';
import { Player, IPlayer } from './playerModel';
import { Match, IMatch } from './matchModels';

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
    search: (query: any) => Promise<any>,
    details: (query: any) => Promise<any>,
    register: (query: any) => Promise<any>,
    destroy: (query: any) => Promise<any>
};

export const TournamentSchema: Schema<ITournament> = new Schema<ITournament>({
    _id: { type: String, required: true },
    name: { type: String },
    date: { type: Date },
    rounds: { type: Number },
    file: { type: String, required: true }
}, { timestamps:  true, _id: false }).index({ _id: 'text', name: 'text' });

TournamentSchema.statics.search = function (query: any): Promise<any> {
    return new Promise((resolve: (tournaments: ITournament[]) => void, reject: (err: IResponse) => void): void => {
        Tournament.find(query)
        .select('-updatedAt -createdAt -__v')
        .then((tournaments: ITournament[]): void => {
            return (resolve(tournaments));
        }).catch((err: any): void => {
                return (reject(InternalError(err)));
        });
    });
};

TournamentSchema.statics.details = function (query: any): Promise<any> {
    return new Promise((resolve: (tournament: ITournament) => void, reject: (err: IResponse) => void): void => {
        Tournament.findById(query)
        .select('-_id -updatedAt -createdAt -__v')
        .then((tournament: ITournament | null): void => {
            if (!tournament) {
                return (reject(QueryIdError));
            } else {
                return (resolve(tournament));
            }
        }).catch((err: any): void => {
            return (reject(InternalError(err)));
        });
    });
};

TournamentSchema.statics.register = function (query: any): Promise<any> {
    return new Promise((resolve: (id: any) => void,   reject: (err: IResponse) => void): void => {
        for (let data of query) {
            Tournament.find({ _id: data.file.tournament.id }).then((tournamentsFind: ITournament[]): void => {
                if (tournamentsFind.length > 0) {
                    return (reject(QueryFoundError));
                } else {
                    new Tournament({
                        _id: data.file.tournament.id,
                        name: data.file.tournament.name.toLowerCase(),
                        date: new Date(data.file.tournament.date),
                        rounds: data.file.tournament.currentround,
                        file: data.name
                    }).save().then((tournament: ITournament): void => {
                        for (let tournPlayer of data.file.tournament.tournamentplayers.tournplayer) {
                            Player.findById(tournPlayer.player.id).then((player: IPlayer | null): void => {
                                if (!player) {
                                    new Player({
                                        _id: tournPlayer.player.id,
                                        firstname: tournPlayer.player.firstname.toLowerCase(),
                                        lastname: tournPlayer.player.lastname.toLowerCase(),
                                        rank: -1,
                                    }).save().catch((err: any): void => {
                                        return (reject(InternalError(err)));
                                    });
                                }
                            });
                        }
                        for (let tournMatch of data.file.tournament.matches.tournmatch) {
                            new Match({
                                tournament: tournament._id,
                                players: ['0' + tournMatch.player[0], '0' + tournMatch.player[1]],
                                winner: '0' + tournMatch.winner,
                                round: tournMatch.round,
                                table: tournMatch.table
                            }).save().catch((err: any): void => {
                                return (reject(InternalError(err)));
                            })
                        }
                        return (resolve({
                            id: tournament._id
                        }));
                    }).catch((err: any): void => {
                        return (reject(InternalError(err)));
                    });
                }
            });
        }
    });
};

TournamentSchema.statics.destroy = function (query: any): Promise<any> {
    return (new Promise((resolve: (status: number) => void, reject: (err: IResponse) => void): void => {
        Tournament.findById(query).then((tournament: ITournament |  null): void => {
            if (!tournament) {
                return (reject(QueryIdError));
            } else {
                tournament.remove().then((doc: any): void => {
                    return (resolve(200));
                }).catch((err: any): void => {
                    return (reject(InternalError(err)));
                });
            }
        });
    }));
};

TournamentSchema.pre<ITournament>('remove', function (next: Function): void {
    Match.find({ tournament: this._id }).then((matches: IMatch[]): void => {
        const tasks: Promise<any>[] = [];
        for (let match of matches) tasks.push(match.remove());
        Promise.all(tasks).then((): void => {
            next();
        }).catch((err: any): void => {
            next(err);
        });
    }).catch((err: any): void => {
        next(err);
    });
});

export const Tournament: ITournamentModel = model<ITournament, ITournamentModel>('Tournament', TournamentSchema);