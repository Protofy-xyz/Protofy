import { Text, TextProps } from 'tamagui'
import React, { useState, useEffect } from "react"
import { API } from '../base/Api'
import { DeviceCollection } from '../bundles/devices/models/DeviceModel';
import { DeviceSubsystemMonitor } from '../bundles/devices/devices';
import { useEventEffect } from '../bundles/events/hooks';

type Props = {
    device: string,
    sensor: string,
    monitor: string,
    noValueText?: string
    enviroment?: string
}

export const SensorValue = React.forwardRef(({ enviroment, device, sensor, monitor, noValueText, ...props }: Props & TextProps, ref: any) => {
    const env = enviroment ?? process.env.NODE_ENV == 'development' ? 'dev' : 'prod'

    const defaultValue = noValueText ?? "n/a"

    const [value, setValue] = useState(defaultValue)
    const [devices, setDevices] = useState([])

    const deviceCollection = new DeviceCollection(devices);
    const subsystem = deviceCollection.getSubsystemByName(device, sensor)
    const data = subsystem.getMonitorByName(monitor) ?? {}
    const monitorData = new DeviceSubsystemMonitor(device, sensor, data)

    const onChange = (e) => {
        try {
            const value = JSON.parse(e.message)
            setValue(value?.payload?.message)
        } catch (e) { }
    }

    useEventEffect(onChange, { path: monitorData.getEventPath() })

    useEffect(() => {
        const updateDevices = async () => {
            const response = await API.get("/adminapi/v1/devices?env=" + env)
            setDevices(response.data?.items)
        }

        updateDevices()

    }, [])

    return <Text ref={ref} {...props}>
        {value ?? defaultValue}
    </Text>;
})