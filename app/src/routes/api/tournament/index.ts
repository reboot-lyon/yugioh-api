import { Router } from 'express';
import { TournamentController } from '../../controllers/tournamentController';
import { MulterFileController } from '../../controllers/multerController';

export default class ToornamentRoutes {

    public router: Router = Router()
    private tournamentContoller: TournamentController = new TournamentController()

    constructor() {
        this.routes();
    }

    private routes(): void {
        this.router.post('/', [ MulterFileController.single('file') ], this.tournamentContoller.bar);
    }
};