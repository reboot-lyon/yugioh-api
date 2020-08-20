import { InvalidInput, IResponse } from '../recipes/responseRecipe';

export function requestLookUp(buffer: any, recip: any, done: (err?: IResponse, payload?: any) => void): void {
    for (let item in recip) {
        if (recip[item] !== undefined && !buffer[item]) {
            return done(InvalidInput, undefined);
        }
        recip[item] = buffer[item];
    }
    return done(undefined, recip);
}