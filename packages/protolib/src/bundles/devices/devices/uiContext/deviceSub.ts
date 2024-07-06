import { DeviceSubsystemMonitor } from '../devicesSchemas';
import { API } from 'protobase';
import mqtt from 'mqtt'
import { useEffect, useRef } from 'react';
import { useIsomorphicLayoutEffect } from 'usehooks-ts'
import {getBrokerUrl} from '../../../../lib/Broker'

export const deviceSub = async (deviceName: string, subsystemName: string, monitorName: string, cb?) => {
    const savedCallback = useRef(cb)
    if (typeof window === "undefined") {
        return null
    }

    useIsomorphicLayoutEffect(() => {
        savedCallback.current = cb
    }, [cb])

    const brokerUrl = getBrokerUrl()
    const client = mqtt.connect(brokerUrl);

    useEffect(() => {
        const prepare = async () => {
            const result = await API.get('/adminapi/v1/devices/' + deviceName)
            if (result.isLoaded) {
                const subsystem = result.data.subsystem.find(s => s.name == subsystemName)
                if (!subsystem) {
                    console.error("Unknown subsystem: ", subsystemName, ' in device: ', deviceName)
                }
                const monitorData = subsystem.monitors.find(m => m.name == monitorName)
                if (!monitorData) {
                    console.error("Error reading monitor: ", monitorName, 'in device: ', deviceName, 'subsytem: ', subsystemName)
                }

                const monitor = new DeviceSubsystemMonitor(deviceName, subsystem.name, monitorData)

                client.on("connect", () => {
                    client.subscribe(monitor.getEndpoint(), (err) => {
                        if (!err) {
                            console.log('Subscribed to: ', monitor.getEndpoint())
                        }
                    });
                });

                client.on("message", (topic, message) => {
                    let msg = message.toString()
                    try { msg = JSON.parse(msg) } catch (e) { }
                    savedCallback.current(msg, topic)
                });
            } else {
                console.error("Error reading device: ", deviceName, result.error)
            }
        }
        prepare()
        return () => { client.end() }
    }, [])


} 