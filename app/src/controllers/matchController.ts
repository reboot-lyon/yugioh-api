import { Response, Request, NextFunction } from 'express';
import { Match } from '../models/matchModels';
import { requestLookUp } from '../utils';
import { IResponse } from '../recipes/responseRecipe';

interface IQueryDetails {
    id: string
};

export class QueryDetails implements IQueryDetails {

    public id: string = ''

    public validate(): Promise<any> {
        return new Promise((resolve: (mongoQuery: any) => void, reject: (err: any) => void): void => {
            if (!this.isValid()) {
                return reject(undefined);
            } else {
                return resolve(this.id);
            }
        });
    }

    private isValid(): boolean {
        return (this.id !== '' ? true : false);
    }
}

export class matchController {

    public detailsHandler(req: Request, res: Response, next: NextFunction): void {
        Match.details(requestLookUp([req.params], new QueryDetails())).then((data: any): void => {
            res.status(200).json(data);
        }).catch((err: IResponse): void => {
            next(err);
        });
    }
}