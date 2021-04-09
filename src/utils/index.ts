import { IResponse, QueryValueError, QueryFieldError } from '../types';

export function recipLookUp(buffer: any, recip: any): Promise<any> {
    return (new Promise((resolve: () => void, reject: (err: IResponse) => void): void => {
        for (const key in recip) {
            if (recip[key] !== undefined && buffer[key] && !buffer[key](recip[key]))
                return (reject(QueryValueError(key)));
        }
        return (resolve());
    }));
};

export function handShake(buffer: any[], recip: any): Promise<any> {
    return (new Promise((resolve: (recip: any) => void, reject: (response: IResponse) => void): void => {
        const marker: any = Object.assign({}, recip);
        for (const key in recip) {
            recip[key] = undefined;
            buffer.forEach((elem) => {
                if (recip[key] === undefined && elem[key] !== undefined)
                    recip[key] = elem[key];
            });
            if (marker[key] !== undefined && recip[key] === undefined)
                return (reject(QueryFieldError(key)));
        }
        console.log(recip);
        recip.validate().then((mongoQuery: any): void => {
            return (resolve(mongoQuery));
        }).catch((err: any): void => {
            return (reject(err));
        });
    }));
};