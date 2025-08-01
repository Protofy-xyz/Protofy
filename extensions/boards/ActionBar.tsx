import { X, Save, Plus, Pause, Play, ClipboardList, Activity, Eye, Settings, Settings2, LayoutDashboard, Book, Code } from 'lucide-react';
import { Tinted } from 'protolib/components/Tinted';
import { useBoardControls } from './BoardControlsContext';
import { ActionBarButton } from 'protolib/components/ActionBarWidget';
import { Separator } from '@my/ui';
import { ActionLogsButton } from 'protolib/components/ActionLogsButton';

const getActionBar = (generateEvent) => {
  const { isJSONView, autopilot, rulesOpened, statesOpened, uiCodeOpened, setViewMode, viewMode } = useBoardControls();

  const bars = {
    'JSONView': [
      <Tinted>
        <ActionBarButton Icon={X} iconProps={{ color: 'var(--gray9)' }} onPress={() => generateEvent({ type: "toggle-json" })} />
      </Tinted>,
      <Tinted>
        <ActionBarButton Icon={Save} onPress={() => generateEvent({ type: "save-json" })} />
      </Tinted>
    ],
    'BoardView': [
      <>
        <Tinted>
          <ActionBarButton tooltipText="Board Settings" Icon={LayoutDashboard} onPress={() => generateEvent({ type: "board-settings" })} />
        </Tinted>
        <Separator vertical boc="$gray7" mt="7px" maxHeight="20px" mx="-5px" />
      </>,
      <Tinted>
        <ActionBarButton tooltipText="Add Card" Icon={Plus} onPress={() => generateEvent({ type: "open-add" })} />
      </Tinted>,
      <Tinted>
        <ActionBarButton
          tooltipText={autopilot ? "Pause Autopilot" : "Play Autopilot"}
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
        <ActionBarButton tooltipText={rulesOpened ? "Close Rules" : "Open Rules"} selected={rulesOpened} Icon={ClipboardList} onPress={() => generateEvent({ type: "toggle-rules" })} />
      </Tinted>,
      <Tinted>
        <ActionBarButton tooltipText={statesOpened ? "Close States" : "Open States"} selected={statesOpened} Icon={Book} onPress={() => generateEvent({ type: "toggle-states" })} />
      </Tinted>,
      <Tinted>
        <ActionBarButton tooltipText="UI Mode" selected={viewMode === "ui"} Icon={Eye} onPress={() => setViewMode(viewMode === "ui" ? "board" : "ui")} />
      </Tinted>,
      <>
        <Separator vertical boc="$gray7" mt="7px" maxHeight="20px" mx="-5px" />
        <ActionLogsButton tooltipText="Logs" />
      </>,
    ],
    'uiView': [
      <Tinted>
        <ActionBarButton tooltipText="Board Mode" selected={viewMode === "ui"} Icon={Eye} onPress={() => setViewMode(viewMode === "ui" ? "board" : "ui")} />
      </Tinted>,
      <Tinted><ActionBarButton
        tooltipText={autopilot ? "Pause Autopilot" : "Play Autopilot"}
        beating={autopilot}
        fill={!autopilot}
        Icon={autopilot ? Pause : Play}
        iconProps={{ ml: autopilot ? 0 : 2 }}
        onPress={() => generateEvent({ type: "toggle-autopilot" })}
        hoverStyle={{ bg: 'var(--color5)' }}
        bc={autopilot ? 'var(--color7)' : 'transparent'}
        br="$20"
      /></Tinted>,
      <Tinted>
        <ActionBarButton tooltipText="Code" selected={rulesOpened} Icon={Code} onPress={() => generateEvent({ type: "toggle-uicode" })} />
      </Tinted>,
      <Tinted>
        <ActionBarButton tooltipText={statesOpened ? "Close States" : "Open States"} selected={statesOpened} Icon={Book} onPress={() => generateEvent({ type: "toggle-states" })} />
      </Tinted>,
    ]
  }

  return isJSONView
    ? bars['JSONView']
    : viewMode === 'ui' ? bars['uiView'] : bars['BoardView'];
};

export default getActionBar;
