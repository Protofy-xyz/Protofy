import { getLogger } from 'protobase';
import {getServiceToken} from 'protonode'

const logger = getLogger()

type DeviceControllerProps = {
    context: any;
    device: string;
    group: string;
    sensors: any[];
    states: any[];
    startActions: any[];
    actions: (device: string) => void;
}

export const deviceController = async ({
    context,
    group,
    device,
    sensors,
    states,
    startActions,
    actions
}: DeviceControllerProps) => {
    startActions.forEach((action) => {
        context.deviceAction(device, action.subsystem, action.action, action.params, null, null);
    });

    sensors.forEach((sensor) => {
        context.state.set({ group: 'boards', tag: device, name: sensor.stateName, value: sensor.initialValue, token: getServiceToken() });
        context.deviceState(context, device, sensor.subsystem, sensor.monitor, (status) => {
            context.state.set({ group: 'boards', tag: device, name: sensor.stateName, value: sensor.value(status), emitEvent: true, token: getServiceToken() });
        });
    });

    states.forEach((state) => {
        context.state.set({
            group: 'boards',
            tag: device,
            ...state,
            token: getServiceToken()
        });
    });

    actions(device)
}