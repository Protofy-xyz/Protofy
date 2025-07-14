import { useEffect, useRef, useState } from 'react'
import { useSubscription } from 'protolib/lib/mqtt'

export const useEvent = (
  eventFilter: { path?: string; from?: string; user?: string } = {},
  onEvent?: (msg: any) => void
) => {
  const sub = useSubscription(
    'notifications/event/create/' + (eventFilter?.path || '')
  )

  const lastSeenId = useRef<number>(0)
  const [lastEvent, setLastEvent] = useState<any>(null)

  // 🔒 Ref estable para evitar recreación del callback
  const stableCallback = useRef<(msg: any) => void>()
  stableCallback.current = onEvent

  useEffect(() => {
    if (!sub?.onMessage) return

    const unsubscribe = sub.onMessage((msg) => {
      try {
        const content = JSON.parse(msg.message)

        if (eventFilter?.from && content.from !== eventFilter.from) return
        if (eventFilter?.user && content.user !== eventFilter.user) return
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
  }, [sub?.onMessage, eventFilter?.path, eventFilter?.from, eventFilter?.user])

  return lastEvent
}