import { Paragraph, Spinner, Stack } from "tamagui"
import ErrorMessage from "./ErrorMessage"
import { TamaCard } from "./TamaCard"
import React, { useState } from "react"
import {Tinted} from './Tinted'
import { useTimeout } from 'usehooks-ts'

const AsyncView = React.forwardRef(({ forceLoad, waitForLoading=0, spinnerSize, atom, error=null, loading=null, children, loadingText, ...props}:any, ref:any) => {
    const [loadingVisible, setLoadingVisible] = useState(waitForLoading?false:true)
    useTimeout(() => setLoadingVisible(true), waitForLoading)
    
    if(forceLoad) return children
    if (atom?.isError) {
        return error ? error : <ErrorMessage details={atom.error} />
    }

    if (!atom?.isLoaded) {
        if(!loadingVisible) return <></>
        //@ts-ignore
        return loading ? loading : <Stack ref={ref} mt="$10" ai="center" jc="center" f={1} {...props}><Tinted><Spinner color="$color6" size={spinnerSize??'large'} /></Tinted>
            <Stack>
                {loadingText && <Paragraph o={0.6} mt="$5">{loadingText}</Paragraph>}
            </Stack>
        </Stack>
    }

    return children
})

export default AsyncView