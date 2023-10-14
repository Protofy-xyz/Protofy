import { useRouter } from 'next/router';
import { useState } from 'react';
import { useUpdateEffect } from 'usehooks-ts';

const omitProp = (obj, prop) => {
    const { [prop]: _, ...rest } = obj; 
    return rest;
};
  
export const usePageParams = (initialState, state, setState) => {
    const { replace, push, query } = useRouter();
    useUpdateEffect(() => {
        setState(query)
    }, [query])

    return {
        push:(key, value) => {
            push({
                query: {
                    ...query,
                    ...state,
                    [key]: value
                }
            }, undefined, { shallow: true })
        },
    
        mergePush: (obj) => {
            push({
                query: {
                    ...query,
                    ...state,
                    ...obj
                }
            }, undefined, { shallow: true })
        },
    
        removePush: (key) => {
            push({query: omitProp(query, key)}, undefined, { shallow: true })
        },
    
        removeReplace: (key) => {
            replace({query: omitProp(query, key)}, undefined, { shallow: true })
        },
    
        replace: (key, value) => {
            replace({
                query: {
                    ...query,
                    ...state,
                    [key]: value
                }
            }, undefined, { shallow: true })
        },
    
        mergeReplace: (obj) => {
            replace({
                query: {
                    ...query,
                    ...state,
                    ...obj
                }
            }, undefined, { shallow: true })
        }
    }
}