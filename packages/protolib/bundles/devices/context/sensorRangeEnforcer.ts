import { getLogger } from 'protolib/base/logger';

const logger = getLogger()
const createDeviceEventPath = (component)=>{
    return `sensor/${component}/state`;
}

export function sensorRangeEnforcer(deviceName, component, monitor,action, context, desiredValue, threshold){
    let desired = Number.parseFloat(desiredValue);
    let thresh = Number.parseFloat(threshold);
    context.onEvent(
        context,
        async (event) => {
          let sensorValue = Number.parseFloat(event.payload.message);
          if(sensorValue > (desired+thresh)){
            await action(1,0)
          }else if(sensorValue < (desired-thresh)){
            await action(0,1)
          }else{
            await action(0,0)
          }
        },
       createDeviceEventPath(component),
        "device"
      );
    
}