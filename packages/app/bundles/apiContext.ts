import { APIContext } from 'protolib/dist/bundles/apiContext'
import {Objects} from './objects'

export default {
    ...APIContext,
    objects: {
        ...Objects
    }
}