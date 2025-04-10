import useMqttState from '../lib/mqtt/useMqttState';
import { CloudOff } from '@tamagui/lucide-icons';
import { useInterval } from 'usehooks-ts';
import { useState } from 'react';
import { XStack } from '@my/ui';

export const ConnectionIndicator = () => {
  const { connectionStatus } = useMqttState();
  const [opacity, setOpacity] = useState(0.8)

  const isConnected = connectionStatus == 'Connected'
  useInterval(() => {setOpacity(opacity==0.1?0.8:0.1)}, !isConnected ? 1000 : null)

  return  isConnected
  ? <XStack o={0.5}>{/*<Cloud strokeWidth={1.5}/>*/}</XStack>
  //@ts-ignore
  :<XStack opacity={opacity} animation={'lazy'}>
    <CloudOff strokeWidth={1.5} color="var(--red11)" />
  </XStack>
}