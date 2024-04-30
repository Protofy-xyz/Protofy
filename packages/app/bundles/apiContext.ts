import ProtolibApiContext from 'protolib/bundles/apiContext'
import {Objects} from './objects'

export default {
    ...ProtolibApiContext,
    objects: {
        ...Objects
    }
}