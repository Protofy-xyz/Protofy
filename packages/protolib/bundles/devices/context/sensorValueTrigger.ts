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
    sensorValue = sensorValue?.value ?? sensorValue

    if (desiredVal == sensorValue) {
        if (equalAction) await equalAction(sensorValue)
    } else {
        if (differentAction) await differentAction(sensorValue)
    }
}