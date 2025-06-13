import { APIContext } from 'protolib/bundles/apiContext'
import {Objects} from './objects'
import machineDefinitions from './stateMachines'
import context from './sharedContext'
import discord from '@extensions/discord/context'
import flow from '@extensions/flow/context'
import flow2 from '@extensions/flow/contextV2'

export default {
    ...APIContext,
    machineDefinitions: {
        ...machineDefinitions
    },
    objects: {
        ...Objects
    },
    ...context,
    discord,
    flow,
    flow2
}