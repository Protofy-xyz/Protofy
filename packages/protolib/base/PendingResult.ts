export type PendingStatus = "pending" | "loading" | "loaded" | "error"
export type PendingResult = {
    status: PendingStatus
    error?: any,
    data: any
    isLoading: boolean,
    isPending: boolean,
    isLoaded: boolean,
    isError: boolean
}

export const getPendingResult = (status:PendingStatus, data?, error?):PendingResult => {
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