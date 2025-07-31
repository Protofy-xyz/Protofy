import { X, Save, Plus, Pause, Play, ClipboardList, Activity, Cog, Settings, Settings2, LayoutDashboard, Book } from 'lucide-react';
import { Tinted } from 'protolib/components/Tinted';
import { useBoardControls } from './BoardControlsContext';
import { ActionBarButton } from 'protolib/components/ActionBarWidget';
import { Separator } from '@my/ui';
import { ActionLogsButton } from 'protolib/components/ActionLogsButton';

const getActionBar = (generateEvent) => {
  const { isJSONView, autopilot, rulesOpened, statesOpened } = useBoardControls();

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
      <>
        <Tinted>
          <ActionBarButton Icon={LayoutDashboard} onPress={() => generateEvent({ type: "board-settings" })} />
        </Tinted>
        <Separator vertical boc="$gray7" mt="7px" maxHeight="20px" mx="-5px" />
      </>,
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
        <ActionBarButton selected={rulesOpened} Icon={ClipboardList} onPress={() => generateEvent({ type: "toggle-rules" })} />
      </Tinted>,
      <Tinted>
        <ActionBarButton selected={statesOpened} Icon={Book} onPress={() => generateEvent({ type: "toggle-states" })} />
      </Tinted>,
      <>
        <Separator vertical boc="$gray7" mt="7px" maxHeight="20px" mx="-5px" />
        <ActionLogsButton/>
      </>,
    ]
};

export default getActionBar;
