import { Grid, Spinner, Stack } from "tamagui"
import ErrorMessage from "./ErrorMessage"
import { TamaCard } from "./TamaCard"
import React from "react"

const AsyncView = React.forwardRef(({ atom, error=null, loading=null, children }:any, ref:any) => {
    if (atom?.isError) {
        return error ? error : <ErrorMessage details={atom.error} />
    }

    if (!atom?.isLoaded) {
        //@ts-ignore
        return loading ? loading : <Stack ref={ref} mt="$10" ai="center" jc="center" f={1}><Spinner size="large" /></Stack>
    }

    return children
})

export default AsyncView