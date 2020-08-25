export function requestLookUp(buffer: any[], recip: any): any {
    const res: any = Object.assign({}, recip);
    for (let key in recip) {
        for (let item of buffer) {
            if (item && item[key]) {
                recip[key] = item[key];
                break;
            }
        }
        if (res[key] !== undefined && !recip[key]) {
            return (undefined);
        }
    }
    return (res);
}
