import { Router } from 'express';
import { matchController } from '../../../controllers/matchController';
import { MulterController } from '../../../controllers/multerController';

export default class MatchRoutes {

    public router: Router = Router()
    private matchContoller: matchController = new matchController()

    constructor() {
        this.routes();
    }

    private routes(): void {
        this.router.get('/', this.matchContoller.searchHandler);
        this.router.get('/:id', MulterController.none(), this.matchContoller.detailsHandler);
    }
};