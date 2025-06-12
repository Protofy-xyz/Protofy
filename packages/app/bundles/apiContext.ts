import { APIContext } from 'protolib/bundles/apiContext'
import {Objects} from './objects'
import machineDefinitions from './stateMachines'
import context from './sharedContext'
import discord from '@extensions/discord/context'

export default {
    ...APIContext,
    machineDefinitions: {
        ...machineDefinitions
    },
    objects: {
        ...Objects
    },
    ...context,
    discord
}