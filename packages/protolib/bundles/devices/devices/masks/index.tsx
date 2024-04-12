import DeviceSub from './DeviceSub';
import DevicePub from './DevicePub';
import SensorRangeEnforcer from './SensorRangeEnforcer';

const deviceMasks = [
    DeviceSub,
    SensorRangeEnforcer,
    // DevicePub
]

export default {
    api: deviceMasks
};