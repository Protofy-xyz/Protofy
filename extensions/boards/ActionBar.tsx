import { X, Save, Plus, Pause, Play, ClipboardList } from 'lucide-react';
import { YStack } from '@my/ui';
import { Tinted } from 'protolib/components/Tinted';
import { useBoardControls } from './BoardControlsContext';

const FloatingButton = ({ Icon, beating = false, ...props }) => {
  const size = 34
  return <YStack
    jc="center"
    ai="center"
    br="$4"
    cursor='pointer'
    scaleIcon={1.8}
    w={size}
    h={size}
    hoverStyle={{ bg: '$gray2' }}
    {...props}
  >
    <Icon size={20} fill={props.fill ? "var(--color)" : "transparent"} {...props.iconProps} />
  </YStack>
}

const getActionBar = (generateEvent) => {
  const { isJSONView, autopilot } = useBoardControls();

  return isJSONView
    ? [
      <Tinted>
        <FloatingButton Icon={X} iconProps={{ color: '$gray9' }} onPress={() => generateEvent({ type: "toggle-json" })} />
      </Tinted>,
      <Tinted>
        <FloatingButton Icon={Save} onPress={() => generateEvent({ type: "save-json" })} />
      </Tinted>
    ]
    : [
      <Tinted>
        <FloatingButton Icon={Plus} onPress={() => generateEvent({ type: "open-add" })} />
      </Tinted>,
      <Tinted>
        <FloatingButton
          beating={autopilot}
          fill={!autopilot}
          Icon={autopilot ? Pause : Play}
          iconProps={{ ml: autopilot ? 0 : 2 }}
          onPress={() => generateEvent({ type: "toggle-autopilot" })}
          hoverStyle={{ bg: '$color5' }}
          bc={autopilot ? '$color7' : 'transparent'}
          br="$20"
        />
      </Tinted>,
      <Tinted>
        <FloatingButton Icon={ClipboardList} onPress={() => generateEvent({ type: "toggle-rules" })} />
      </Tinted>
    ]
};

export default getActionBar;
