import { Request, Response, NextFunction } from 'express';
import { InvalidPath } from '../../recipes/responseRecipe';

export default class ErrorController {

    public trigger(req: Request, res: Response, next: NextFunction): void {
        next(InvalidPath(req.method));
    };

    public hanlder(err: any, req: Request, res: Response, next: NextFunction): void {
        res.status(err.status || 500);
        res.json({
            error: {
                name: err.name,
                message: err.message,
                status: err.status,
            }
        })
    }
}