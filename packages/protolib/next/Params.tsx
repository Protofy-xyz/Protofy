import { useRouter } from 'next/router';
import { useState } from 'react';
import { useUpdateEffect } from 'usehooks-ts';

const omitProp = (obj, prop) => {
    const { [prop]: _, ...rest } = obj; 
    return rest;
};

export const useQueryState = (setState) => {
    const { query } = useRouter();
    useUpdateEffect(() => {
        setState(query)
    }, [query])
}
  
export const usePageParams = (state) => {
    const { replace, push, query } = useRouter();

    return {
        push:(key, value, shallow=true) => {
            push({
                query: {
                    ...query,
                    ...state,
                    [key]: value
                }
            }, undefined, { shallow: shallow })
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