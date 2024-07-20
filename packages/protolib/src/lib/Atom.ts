import {useAtom as _useAtom} from 'jotai'
import { PendingResult } from 'protobase'

export const useAtom = (atom, initialState?) => {
    const [content, setContent] = _useAtom<PendingResult>(atom)
    return (initialState && (content.isPending)) ? [initialState, setContent] : [content, setContent]
}