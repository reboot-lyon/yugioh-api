import { Router } from 'express';
import TournamentRoutes from './tournament';

export default class ApiRoutes {

    public router: Router
    private tournamentRoutes: TournamentRoutes = new TournamentRoutes()

    constructor() {
        this.router = Router();
        this.routes();
    }

    private routes(): void {
        this.router.use('/tournament', this.tournamentRoutes.router);
    }
};