import {useUpdateEffect} from 'usehooks-ts'
import {useAtom} from 'jotai'
import {useHydrateAtoms} from 'jotai/utils'

export const useHydratedAtom= (atomState, hydrateState, userAtom?):any => {
    if(hydrateState) {
        useHydrateAtoms([[atomState, hydrateState]])
    }
    let atomVal = useAtom(userAtom??atomState)
    useUpdateEffect(() => {
        atomVal[1](hydrateState)
    }, [hydrateState])
    return atomVal
}