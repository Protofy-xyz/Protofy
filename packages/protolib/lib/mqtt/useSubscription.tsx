import { useContext, useEffect, useCallback, useState, useRef } from 'react'
import { IClientSubscribeOptions } from 'mqtt'
import { matches } from 'mqtt-pattern'
import MqttContext from './Context'
import { IMqttContext as Context, IUseSubscription, IMessage } from './types'

type UseSubscriptionOptions = IClientSubscribeOptions & {
  maxLog?: number
}

export default function useSubscription(
  topic: string | string[],
  subscriptionOptions: UseSubscriptionOptions = { maxLog: 100 }
): IUseSubscription {
  const { client, connectionStatus, parserMethod } = useContext<Context>(MqttContext)
  const [message, setMessage] = useState<IMessage | undefined>(undefined)
  const [messages, setMessages] = useState<IMessage[]>([])

  const lastId = useRef(1)
  const queueRef = useRef<IMessage[]>([])  // ✅ Cola real
  const listenersRef = useRef<((msg: IMessage) => void)[]>([]) // ✅ Callbacks suscritos

  const { maxLog, ...options } = subscriptionOptions

  const subscribe = useCallback(() => {
    client?.subscribe(topic, options)
  }, [client, options, topic])

  const callback = useCallback(
    (receivedTopic: string, receivedMessage: any) => {
      if ([topic].flat().some(rTopic => matches(rTopic, receivedTopic))) {
        const msg = parserMethod?.(receivedMessage) || receivedMessage.toString()
        const cId = lastId.current++

        const fullMsg: IMessage = {
          id: cId,
          topic: receivedTopic,
          message: msg,
        }

        queueRef.current.push(fullMsg) // 🧠 Mete a cola inmediatamente
        setMessages(prev => [fullMsg, ...prev.slice(0, maxLog)])
        setMessage(fullMsg)

        // ✅ Notifica a todos los listeners registrados
        for (const fn of listenersRef.current) {
          fn(fullMsg)
        }
      }
    },
    [parserMethod, topic]
  )

  useEffect(() => {
    if (client?.connected) {
      subscribe()
      client.on('message', callback)
    }
    return () => {
      client?.off('message', callback)
    }
  }, [callback, client, subscribe])

  // ✅ función pública para registrar callbacks reactivos
  const onMessage = useCallback((cb: (msg: IMessage) => void) => {
    listenersRef.current.push(cb)
    return () => {
      // cleanup
      listenersRef.current = listenersRef.current.filter(fn => fn !== cb)
    }
  }, [])

  return {
    client,
    topic,
    message,
    messages,
    setMessages,
    clearMessages: () => setMessages([]),
    connectionStatus,
    onMessage, // 🆕 expositor del sistema de eventos reactivo
  }
}