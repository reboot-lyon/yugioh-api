import express, { Router } from 'express';
import ErrorController from '../controllers/errorController';
import ApiRoutes from './api';
import path from 'path';

export default class Routes {

    public router: Router
    public errorController: ErrorController = new ErrorController()
    private apiRoutes: ApiRoutes = new ApiRoutes()

    constructor() {
        this.router = Router();
        this.routes();
    }

    public routes(): void {
        this.router.use('/api', this.apiRoutes.router);
        this.router.use('/static', express.static(path.resolve(__dirname, '../../../public'), { cacheControl: false }));
        this.router.use(this.errorController.trigger);
    }
}