import { onEvent } from 'protolib/bundles/events/api'
import { automation, fetch, deviceAction, deviceMonitor } from 'protolib/bundles/apis/api/'
import {createSchedule} from 'protolib/bundles/automations/schedule'

export default {
    onEvent,
    automation,
    fetch,
    deviceAction,
    deviceMonitor,
    createSchedule
}