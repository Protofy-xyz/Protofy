import { Paragraph, SizableText, Spinner, Stack, StackProps } from "tamagui"
import ErrorMessage from "./ErrorMessage"
import React, { useState } from "react"
import {Tinted} from './Tinted'
import { useTimeout } from 'usehooks-ts'

type AsyncViewType = {
    atom?: any,
    forceLoad?: boolean,
    waitForLoading?: number,
    spinnerSize?: any,
    ready?: boolean,
    error?: string | React.ReactNode,
    loading?: string | React.ReactNode,
    children?: React.ReactNode[] | React.ReactNode | undefined,
    loadingText?: string,
}

export const AsyncView = React.forwardRef(({
    atom,
    ready,
    forceLoad, 
    waitForLoading=250, 
    spinnerSize, 
    error, 
    loading=null, 
    children, 
    loadingText="Loading...", 
    ...props
}:AsyncViewType & StackProps, ref:any) => {
    const [loadingVisible, setLoadingVisible] = useState(waitForLoading?false:true)
    useTimeout(() => setLoadingVisible(true), waitForLoading)
    
    if(forceLoad) return children
    
    if (error) {
        return <ErrorMessage details={error} />
    } else if(atom && atom.isError) {
        return <ErrorMessage details={atom.error?.result??atom.error} />
    }

    if ((!atom && !ready) || (atom && !atom.isLoaded)) {
        if(!loadingVisible) return <></>
        //@ts-ignore
        return loading ? loading : <Stack ref={ref} mt="$10" ai="center" jc="center" f={1} {...props}><Tinted><Spinner color="$color6" size={spinnerSize??'large'} /></Tinted>
            <Stack>
                {loadingText && <SizableText o={0.6} fontWeight="700" mt="$5">{loadingText}</SizableText>}
            </Stack>
        </Stack>
    }

    return children
})

export default AsyncView