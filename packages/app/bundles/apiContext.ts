import { onEvent, emitEvent } from 'protolib/bundles/events/api'
import { automation, fetch, deviceAction, deviceMonitor } from 'protolib/bundles/apis/api/'
import {createSchedule} from 'protolib/bundles/automations/schedule'

export default {
    onEvent,
    emitEvent,
    automation,
    fetch,
    deviceAction,
    deviceMonitor,
    createSchedule,
}