import {useUpdateEffect} from 'usehooks-ts'
import {useHydrateAtoms} from 'jotai/utils'
import {useAtom as _useAtom} from 'jotai'
import { PendingAtomResult } from './createApiAtom'

export const useAtom = (atom, initialState?) => {
    const [content, setContent] = _useAtom<PendingAtomResult>(atom)
    return (initialState && (content.isPending)) ? [initialState, setContent] : [content, setContent]
}