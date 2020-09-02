export interface IResponse {
    name: string,
    message: string,
    status: number
};

abstract class Response implements IResponse {
    name: string = ''
    message: string = ''
    status: number = 200

    constructor(message: string) {
        this.message = message;
    }
};

class QueryError extends Response {
    name: string = 'QueryError'
};

class ServerError extends Response {
    name: string = 'InternalError'
};

class TokenError extends Response {
    name: string = 'TokenError'
};

export const InvalidPath: Function = (method: string): IResponse => {
    return { name: method, message: 'Unexpected path', status: 400 };
};

export const QueryFieldError: IResponse = new QueryError('Unexpected field');
export const QueryValuedError: IResponse = new QueryError('Unexpected value');
export const QueryIdError: IResponse = new QueryError('Unexpected id');
export const QueryFileError: IResponse = new QueryError('Unexpected file');
export const QueryNotFoundError: IResponse = new QueryError('Item not found');
export const QueryFoundError: IResponse = new QueryError('Item already exist');

export const InternalError: IResponse = new ServerError(':(');


export const TokenSignError: IResponse = new TokenError('Unexpected signature');
export const TokenBuffError: IResponse = new TokenError('Unexpected payload');
export const TokenExpError: IResponse = new TokenError('Expirated');