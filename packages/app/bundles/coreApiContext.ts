import { APIContext } from 'protolib/bundles/apiContext'
import ProtolibObjects from 'protolib/bundles/objects'
import context from './sharedContext'
export default {
    ...APIContext,
    objects: {
        ProtolibObjects
    },
    ...context
}