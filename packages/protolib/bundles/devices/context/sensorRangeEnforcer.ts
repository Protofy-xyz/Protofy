import { getLogger } from 'protolib/base/logger';

const logger = getLogger()
const createDeviceEventPath = (deviceName, component, monitor) => {
  return `sensor/${component}/state`;
}

export function sensorRangeEnforcer(
  deviceName,
  component,
  monitor,
  context,
  desiredValue,
  threshold,
  aboveAction,
  belowAction,
  onRangeAction
) {
  let desired = Number.parseFloat(desiredValue);
  let thresh = Number.parseFloat(threshold);
  context.deviceSub(
    deviceName,
    component,
    monitor,
    async (message, topic) => {
      let sensorValue = Number.parseFloat(message);
      let delta = Math.abs(sensorValue - desired)
      if (sensorValue > (desired + thresh)) {
        if(aboveAction) await aboveAction(delta)
      } else if (sensorValue < (desired - thresh)) {
        if(belowAction) await belowAction(delta)
      } else {
        if(onRangeAction) await onRangeAction(delta)
      }
    }
  );

}