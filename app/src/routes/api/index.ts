import { Router } from 'express';
import TournamentRoutes from './tournaments';
import PlayerRoutes from './players';
import MatchRoutes from './matches';

export default class ApiRoutes {

    public router: Router
    private tournamentRoutes: TournamentRoutes = new TournamentRoutes()
    private playerRoutes: PlayerRoutes = new PlayerRoutes();
    private matchRoutes: MatchRoutes = new MatchRoutes();

    constructor() {
        this.router = Router();
        this.routes();
    }

    private routes(): void {
        this.router.use('/tournaments', this.tournamentRoutes.router);
        this.router.use('/matches', this.matchRoutes.router);
        this.router.use('/players', this.playerRoutes.router);
    }
};