import { useEffect, useRef, useState } from 'react'
import { useSubscription } from 'protolib/lib/mqtt'

const levelTable = {
    trace: 10,
    debug: 20,
    info: 30,
    warn: 40,
    error: 50,
    fatal: 60
}

export const useLog = (
    onLog?: (msg: any) => void,
    appName?: string,
    level?: keyof typeof levelTable,
    filter?: string
) => {
    const sub = useSubscription(
        'logs' + (appName ? `/${appName}` : '/+') + (level ? `/${levelTable[level]}` : '/+') + (filter ? `/${filter}` : '/#')
    )

    const lastSeenId = useRef<number>(0)
    const [lastEvent, setLastEvent] = useState<any>(null)

    // 🔒 Ref estable para evitar recreación del callback
    const stableCallback = useRef<(msg: any) => void>()
    stableCallback.current = onLog

    useEffect(() => {
        if (!sub?.onMessage) return

        const unsubscribe = sub.onMessage((msg) => {
            try {
                const content = JSON.parse(msg.message)
                if (msg.id <= lastSeenId.current) return

                lastSeenId.current = msg.id
                const fullMsg = { ...msg, parsed: content }

                stableCallback.current?.(fullMsg)
                setLastEvent(fullMsg)
            } catch (e) {
                console.error('Error parsing MQTT message:', e)
            }
        })

        return () => {
            unsubscribe?.()
        }
    }, [sub?.onMessage, filter, appName, level])

    return lastEvent
}