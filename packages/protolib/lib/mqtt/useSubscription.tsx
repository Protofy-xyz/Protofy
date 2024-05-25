import { useContext, useEffect, useCallback, useState, useRef } from 'react';

import { IClientSubscribeOptions } from 'mqtt';
import { matches } from 'mqtt-pattern';

import MqttContext from './Context';
import { IMqttContext as Context, IUseSubscription, IMessage } from './types';

type UseSubscriptionOptions = IClientSubscribeOptions & {
  maxLog?: number
}

export default function useSubscription(
  topic: string | string[],
  subscriptionOptions: UseSubscriptionOptions = {maxLog: 100} as UseSubscriptionOptions,
): IUseSubscription {
  const { client, connectionStatus, parserMethod } = useContext<Context>(
    MqttContext,
  );

  const [message, setMessage] = useState<IMessage | undefined>(undefined);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const lastId = useRef(1)
  const {maxLog, ...options} = subscriptionOptions

  const subscribe = useCallback(async () => {
    client?.subscribe(topic, options);
  }, [client, options, topic]);

  const callback = useCallback(
    (receivedTopic: string, receivedMessage: any) => {
      if ([topic].flat().some(rTopic => matches(rTopic, receivedTopic))) {
        const msg = parserMethod?.(receivedMessage) || receivedMessage.toString()
        const cId = lastId.current++
        setMessages(prevMessges => [{id: cId, topic: receivedTopic, message: msg}, ...prevMessges.slice(0, maxLog)]);
        setMessage({
          topic: receivedTopic,
          message: msg,
          id: cId
        });
      }
    },
    [parserMethod, topic],
  );

  useEffect(() => {
    if (client?.connected) {
      subscribe();

      client.on('message', callback);
    }
    return () => {
      client?.off('message', callback);
    };
  }, [callback, client, subscribe]);

  return {
    client,
    topic,
    message,
    messages,
    setMessages,
    clearMessages: () => setMessages([]),
    connectionStatus,
  };
}