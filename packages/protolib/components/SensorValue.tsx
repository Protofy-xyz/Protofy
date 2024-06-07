import { Text, TextProps } from 'tamagui'
import React, { useState, useEffect } from "react"
import { useSubscription } from '../lib/mqtt'

type Props = {
    device: string,
    sensor: string,
    noValueText?: string
}

export const SensorValue = React.forwardRef(({ device, sensor, noValueText, ...props }: Props & TextProps, ref: any) => {
    const defaultValue = noValueText ?? "n/a"

    const [value, setValue] = useState(defaultValue)

    //TODO: topic should come from DeviceSubsystemMonitor once refactor it's model or similar
    const { message } = useSubscription('devices/' + device + "/sensor/" + sensor + "/state")

    useEffect(() => {
        setValue(message?.message)
    }, [message]);

    return <Text ref={ref} {...props}>
        {value ?? defaultValue}
    </Text>;
})