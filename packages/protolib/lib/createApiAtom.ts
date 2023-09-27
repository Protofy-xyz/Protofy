import { atom } from "jotai";

type PendingAtomStatus = "pending" | "loading" | "loaded" | "error"
export type PendingAtomResult = {
    status: PendingAtomStatus
    error?: string|null,
    data: any
    isLoading: boolean,
    isPending: boolean,
    isLoaded: boolean,
    isError: boolean
}

export const getPendingResult = (status:PendingAtomStatus, data?, error?):PendingAtomResult => {
    return {
        status: status,
        data: data,
        error: error?error:null,
        isError: status == 'error',
        isLoading: status == 'loading',
        isLoaded: status == 'loaded',
        isPending: status == 'pending'
    }
}
  
export const createApiAtom = (initialState) => atom<PendingAtomResult>(getPendingResult("pending", initialState))