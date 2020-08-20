import { Router } from 'express';
import FooController from '../controllers/fooController';

export default class ApiRoutes {

    public router: Router
    private fooController: FooController = new FooController()

    constructor() {
        this.router = Router();
        this.routes();
    }

    private routes(): void {
        this.router.get('/foo', this.fooController.bar);
    }
};