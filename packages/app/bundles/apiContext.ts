import { onEvent } from 'protolib/bundles/events/api'
import { automation, fetch, deviceAction, deviceMonitor } from 'protolib/bundles/apis/api/'
import {createCronJob} from 'protolib/bundles/automations/cron'

export default {
    onEvent,
    automation,
    fetch,
    deviceAction,
    deviceMonitor,
    createCronJob
}