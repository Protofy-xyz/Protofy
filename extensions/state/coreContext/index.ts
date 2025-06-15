import { setContext } from './setContext'
import { getContext } from './getContext'
import { getStateTree } from './getStateTree'
import { appendContext } from './appendContext'

export default {
    set: setContext,
    get: getContext,
    getStateTree: getStateTree,
    append: appendContext
}