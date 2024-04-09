import { onEvent, emitEvent } from 'protolib/bundles/events/api'
import { automation, fetch, deviceAction, deviceMonitor } from 'protolib/bundles/apis/context/'
import {createSchedule} from 'protolib/bundles/automations/schedule'
import { sendMailWithResend } from 'protolib/bundles/resend/context'

export default {
    onEvent,
    emitEvent,
    automation,
    fetch,
    deviceAction,
    deviceMonitor,
    createSchedule,
    sendMailWithResend
}