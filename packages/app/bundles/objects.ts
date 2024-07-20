import ProtolibObjects from 'protolib/dist/bundles/objects'
import LocalObjects from './custom/objects'

export const Objects = {
    ...ProtolibObjects,
    ...LocalObjects,
}
