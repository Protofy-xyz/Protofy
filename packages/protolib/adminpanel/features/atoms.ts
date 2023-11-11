import {getPendingResult, PendingAtomResult} from '../../lib/createApiAtom';
import {atom} from 'jotai'
export const workspaceAtom = atom<any>({menu: {}, resources: {}})
