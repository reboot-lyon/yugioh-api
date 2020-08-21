export interface IResponse {
    name: string,
    message: string,
    status: number
}

export const InvalidPath: Function = (method: string): IResponse => {
    return { name: method, message: 'Invalid Path', status: 400 };
};
export const InvalidInput: IResponse = { name: 'Input', message: 'Invalid Input', status: 400 };
export const InternalError: IResponse = { name: 'Internal', message: 'Internal error', status: 500 };
export const InvalidUsername: IResponse = { name: 'Username', message: 'Invalid username', status: 400 };
export const InvalidPasswd: IResponse = { name: 'Passwd', message: 'Invalid passwd', status: 400 };
export const InvalidEmail: IResponse = { name: 'Email', message: 'Invalid email', status: 400 };
export const InvalidTokenSignature: IResponse = { name: 'Token signature', message: 'Invalid token signature', status: 400 };
export const InvalidTokenPayload: IResponse = { name: 'Token payload', message: 'Invalid token payload', status: 400 };
export const InvalidTokenExp: IResponse = { name: 'Expiration', message: 'Token expirated', status: 4000 };
export const AlreadyUsername: IResponse = { name: 'Username', message: 'Username already exist', status: 400 };
export const AlreadyEmail: IResponse = { name: 'Email', message: 'Email already exist', status: 400 };
export const InvalidFile: IResponse = { name: 'File', message: 'Invalid file extension', status: 400 };