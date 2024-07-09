import { APIContext } from 'protolib/bundles/apiContext'
import {Objects} from './objects'

export default {
    ...APIContext,
    objects: {
        ...Objects
    }
}