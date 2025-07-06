import { Text, TextProps } from '@my/ui'
import React, { useState, useEffect } from "react"
import { API } from 'protobase'
import { DeviceCollection } from '@extensions/devices/models/DeviceModel';
import { DeviceSubsystemMonitor } from '@extensions/devices/devices';
import { useLastEvent } from '@extensions/events/hooks';

type Props = {
    device: string,
    sensor: string,
    monitor: string,
    noValueText?: string
}

export const SensorValue = React.forwardRef(({device, sensor, monitor, noValueText, ...props }: Props & TextProps, ref: any) => {
    const defaultValue = noValueText ?? "n/a"

    const [devices, setDevices] = useState([])

    const deviceCollection = new DeviceCollection(devices);
    const subsystem = deviceCollection.getSubsystemByName(device, sensor)
    const data = subsystem.getMonitorByName(monitor) ?? {}
    const monitorData = new DeviceSubsystemMonitor(device, sensor, data)

    const value: any = useLastEvent({ path: monitorData.getEventPath() != "" ? monitorData.getEventPath() : null })

    useEffect(() => {
        const updateDevices = async () => {
            const response = await API.get("/api/core/v1/devices")
            setDevices(response.data?.items)
        }

        updateDevices()

    }, [])

    return <Text ref={ref} {...props}>
        {(value && value?.payload?.message) ?? defaultValue}
    </Text>;
})