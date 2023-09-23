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
  
export const createApiAtom = (initialState) => {
    const stateAtom = atom<PendingAtomResult>(getPendingResult("pending", initialState))
    const apiAtom = atom(
      (get) => get(stateAtom), 
      (get, set, update: any) => {
        set(stateAtom, update);
      }
    );
    return [stateAtom, apiAtom]
}