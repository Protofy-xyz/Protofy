import { PendingAtomResult, getPendingResult } from "./createApiAtom";

const SERVER = process?.env?.API_URL ?? 'http://localhost:3001'

class ApiError extends Error {
    apiError: any;

    constructor(message: string, { data }: { data: any }) {
        super(message);
        this.apiError = data
    }
}

const _fetch = async (url, data?, update?):Promise<PendingAtomResult | undefined> => {
    const realUrl = typeof window === 'undefined' ? SERVER + url : url
    const fn = async () => {
        update ? update(getPendingResult('loading')) : null
        try {
            const res = await fetch(realUrl, data? {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data) 
            }:undefined);


            const resData = await res.json()
            if (!res.ok) {
                const err = getPendingResult('error', null, resData)
                if (update) {
                    update(err)
                } else {
                    return err
                }
                return;
            }
            const response = getPendingResult('loaded', resData);
            if (update) {
                update(response)
            } else {
                return response
            }
        } catch (e: any) {
            let errStr = e.apiError ?? e.toString()
            if (e instanceof SyntaxError) {
                errStr = 'Server error. Check configuration and network connection.'
            }
            const err = getPendingResult('error', null, errStr)
            if (update) {
                update(err)
            } else {
                return err
            }
        }
    }
    if (update) {
        fn()
    } else {
        return fn()
    }

}
export const API = {
    fetch: _fetch,
    get: (url, update?):Promise<PendingAtomResult | undefined> => _fetch(url, null, update),
    post: (url, data, update?):Promise<PendingAtomResult | undefined> => _fetch(url, data, update)
}