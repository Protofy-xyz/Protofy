import { APIContext } from 'protolib/src/bundles/apiContext'
import {Objects} from './objects'

export default {
    ...APIContext,
    objects: {
        ...Objects
    }
}