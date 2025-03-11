import { getLogger } from 'protobase';

const logger = getLogger()

type DeviceControllerProps = {
    context: any;
    device: string;
    sensors: any[];
    states: any[];
    startActions: any[];
    actions: (device: string) => void;
}

export const deviceController = async ({
    context,
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
        context.state.set({ tag: device, name: sensor.stateName, value: sensor.initialValue });
        context.deviceState(context, device, sensor.subsystem, sensor.monitor, (status) => {
            context.state.set({ tag: device, name: sensor.stateName, value: sensor.value(status), emitEvent: true });
        });
    });

    states.forEach((state) => {
        context.state.set({
            tag: device,
            ...state
        });
    });

    actions(device)
}