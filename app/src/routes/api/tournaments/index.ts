import { Router } from 'express';
import { TournamentController } from '../../../controllers/tournamentController';
import { MulterFileController, MulterController } from '../../../controllers/multerController';

export default class ToornamentRoutes {

    public router: Router = Router()
    private tournamentContoller: TournamentController = new TournamentController()

    constructor() {
        this.routes();
    }

    private routes(): void {
        this.router.get('/', MulterController.none(), this.tournamentContoller.searchHandler);
        this.router.get('/:id', MulterController.none(), this.tournamentContoller.detailsHandler);
        this.router.post('/', MulterFileController.fields([{ name: 'files', maxCount: 2 }]), this.tournamentContoller.registerHandler);
        this.router.put('/:id', this.tournamentContoller.editHandler);
        this.router.delete('/:id', this.tournamentContoller.destroyHandler);
    }
};