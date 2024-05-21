import { SetStateAction, atom, useAtom } from 'jotai';
import { useEffect } from 'react';
import mqtt from 'mqtt'
import { getBrokerUrl } from './Broker';

let client;

const brokerUrl = getBrokerUrl()
export const LogMessages = atom([])

export const useLogMessages = () => {
    const [messages, setMessages] = useAtom<any>(LogMessages)
    const maxLog = 100
    useEffect(() => {
        if (typeof window === "undefined") {
            return null
        }
        if(!client) {
            const client = mqtt.connect(brokerUrl);
            client.on('connect', function () {
                client.subscribe('logs/#', function (err) {
                    if (!err) {
                        console.log('connected to logs')
                    }
                })
            })
            
            client.on('message', function (topic, message) {
                // message is Buffer
                const msg = message.toString()
                setMessages(prevMessages => [{topic: topic, message: JSON.parse(msg)}, ...prevMessages.slice(0, maxLog)]);
            })

            return () => {
                client.end()
            }
        }
    }, [])

    return [messages, setMessages]
}