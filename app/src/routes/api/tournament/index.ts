import { Router } from 'express';
import Multer from 'multer';
import { TournamentController } from '../../controllers/tournamentController';
import { MULTER_UI } from '../../../config';

export default class ToornamentRoutes {

    public router: Router = Router()
    private tournamentContoller: TournamentController = new TournamentController()
    private multer: any = Multer({ dest: MULTER_UI })

    constructor() {
        this.routes();
    }

    private routes(): void {
        this.router.post('/', [this.multer.single('file')], this.tournamentContoller.bar);
    }
};