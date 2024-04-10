import DeviceSub from './DeviceSub';
import DevicePub from './DevicePub';
import SensorRangeEnforcer from './SensorRangeEnforcer';
import SensorValueTrigger from './SensorValueTrigger';

const deviceMasks = [
    DeviceSub,
    SensorRangeEnforcer,
    SensorValueTrigger
    // DevicePub
]

export default {
    api: deviceMasks
};