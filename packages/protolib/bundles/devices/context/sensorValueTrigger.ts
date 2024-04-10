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
    let desiredVal = Number.parseFloat(desiredValue)
    let sensorValue = await context.deviceMonitor(deviceName, component, monitor);
    logger.info(sensorValue.toString(), "papupi")
    if(desiredVal == sensorValue){
        await equalAction(sensorValue)
    }else{
        await differentAction(sensorValue)
    }
}