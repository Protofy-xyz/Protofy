import { APIContext } from 'protolib/bundles/apiContext'
import {Objects} from './objects'
import machineDefinitions from './stateMachines'

export default {
    ...APIContext,
    machineDefinitions: {
        ...machineDefinitions
    },
    objects: {
        ...Objects
    }
}