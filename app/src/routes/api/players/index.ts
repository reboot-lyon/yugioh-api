import { Router } from 'express';
import { playerController } from '../../../controllers/playerController';
import { MulterController } from '../../../controllers/multerController';

export default class PlayerRoutes {

    public router: Router = Router()
    private playerContoller: playerController = new playerController()

    constructor() {
        this.routes();
    }

    private routes(): void {
        this.router.get('/', MulterController.none(), this.playerContoller.searchHandler);
        this.router.get('/:id', MulterController.none(), this.playerContoller.detailsHandler);
    }
};