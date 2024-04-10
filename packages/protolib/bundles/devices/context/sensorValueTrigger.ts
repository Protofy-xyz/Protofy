import { getLogger } from 'protolib/base/logger';

const logger = getLogger()


export async function sensorValueTrigger(
    deviceName,
    component,
    monitor,
    context,
    desiredValue,
    equalAction,
    differentAction
) {
    let desiredVal = desiredValue
    let sensorValue = await context.deviceMonitor(deviceName, component, monitor);
    if (desiredVal == sensorValue?.value) {
        if (equalAction) await equalAction(sensorValue?.value)
    } else {
        if (differentAction) await differentAction(sensorValue?.value)
    }
}