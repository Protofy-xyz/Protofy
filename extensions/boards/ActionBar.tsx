import { X, Save, Plus, Pause, Play, ClipboardList, Activity } from 'lucide-react';
import { Tinted } from 'protolib/components/Tinted';
import { useBoardControls } from './BoardControlsContext';
import { ActionBarButton } from 'protolib/components/ActionBarWidget';
import { Separator } from '@my/ui';

const getActionBar = (generateEvent) => {
  const { isJSONView, autopilot } = useBoardControls();

  return isJSONView
    ? [
      <Tinted>
        <ActionBarButton Icon={X} iconProps={{ color: 'var(--gray9)' }} onPress={() => generateEvent({ type: "toggle-json" })} />
      </Tinted>,
      <Tinted>
        <ActionBarButton Icon={Save} onPress={() => generateEvent({ type: "save-json" })} />
      </Tinted>
    ]
    : [
      <Tinted>
        <ActionBarButton Icon={Plus} onPress={() => generateEvent({ type: "open-add" })} />
      </Tinted>,
      <Tinted>
        <ActionBarButton
          beating={autopilot}
          fill={!autopilot}
          Icon={autopilot ? Pause : Play}
          iconProps={{ ml: autopilot ? 0 : 2 }}
          onPress={() => generateEvent({ type: "toggle-autopilot" })}
          hoverStyle={{ bg: 'var(--color5)' }}
          bc={autopilot ? 'var(--color7)' : 'transparent'}
          br="$20"
        />
      </Tinted>,
      <Tinted>
        <ActionBarButton Icon={ClipboardList} onPress={() => generateEvent({ type: "toggle-rules" })} />
      </Tinted>,
      <Tinted>
        <Separator vertical boc="$gray7" mt="7px" maxHeight="20px" mx="-5px" />
        <ActionBarButton Icon={Activity} onPress={() => generateEvent({ type: "toggle-logs" })} />
      </Tinted>,
    ]
};

export default getActionBar;
