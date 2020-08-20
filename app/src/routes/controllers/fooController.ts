import { Request, Response, NextFunction } from 'express';

export default class Foo {

    public bar(req: Request, res: Response, next: NextFunction) {
        res.json({
            res: {
                foo: 'bar'
            }
        });
    }
}
