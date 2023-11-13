import { useMqttState  } from 'mqtt-react-hooks';
import { Cloud, CloudOff } from '@tamagui/lucide-icons';
import { useInterval } from 'usehooks-ts';
import { useState } from 'react';
import { XStack } from 'tamagui';

export const ConnectionIndicator = () => {
  const { connectionStatus } = useMqttState();
  const [opacity, setOpacity] = useState(0.8)

  const isConnected = connectionStatus == 'Connected'
  useInterval(() => {setOpacity(opacity==0.1?0.8:0.1)}, !isConnected ? 1000 : null)

  return  isConnected? <Cloud />:<XStack opacity={opacity} animation={'lazy'}><CloudOff color="var(--red11)" /></XStack>
}