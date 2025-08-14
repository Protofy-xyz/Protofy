import { X, Save, Plus, Pause, Play, ClipboardList, Activity, Eye, Settings, Presentation, LayoutDashboard, Book, Code } from 'lucide-react';
import { useBoardControls } from './BoardControlsContext';
import { ActionBarButton } from 'protolib/components/ActionBarWidget';
import { Separator } from '@my/ui';

const AutopilotButton = ({ generateEvent, autopilot }) => <ActionBarButton
  tooltipText={autopilot ? "Pause Autopilot" : "Play Autopilot"}
  beating={autopilot}
  fill={true}
  Icon={autopilot ? Pause : Play}
  iconProps={{ ml: autopilot ? 0 : 2, fill: "var(--bgPanel)", color: "var(--bgPanel)" }}
  onPress={() => generateEvent({ type: "toggle-autopilot" })}
  hoverStyle={{ scale: 1.05 }}
  bc={autopilot ? 'var(--color8)' : "var(--color)"}
  br={"$20"}
/>

const getActionBar = (generateEvent) => {
  const { isJSONView, autopilot, setViewMode, viewMode, tabVisible } = useBoardControls();

  const bars = {
    'JSONView': [
      <ActionBarButton Icon={X} iconProps={{ color: 'var(--gray9)' }} onPress={() => generateEvent({ type: "toggle-json" })} />,
      <ActionBarButton Icon={Save} onPress={() => generateEvent({ type: "save-json" })} />
    ],
    'BoardView': [
      <ActionBarButton tooltipText="Add Card" Icon={Plus} onPress={() => generateEvent({ type: "open-add" })} />,
      <ActionBarButton tooltipText={tabVisible == "rules" ? "Close Rules" : "Open Rules"} selected={tabVisible == "rules"} Icon={ClipboardList} onPress={() => generateEvent({ type: "toggle-rules" })} />,
      <ActionBarButton tooltipText={tabVisible == "states" ? "Close States" : "Open States"} selected={tabVisible == "states"} Icon={Book} onPress={() => generateEvent({ type: "toggle-states" })} />,
      <AutopilotButton generateEvent={generateEvent} autopilot={autopilot} />,
      <ActionBarButton tooltipText="Logs" selected={tabVisible == "logs"} Icon={Activity} onPress={() => generateEvent({ type: "toggle-logs" })} />,
      <ActionBarButton tooltipText="Board Settings" selected={tabVisible == "board-settings"} Icon={Settings} onPress={() => generateEvent({ type: "board-settings" })} />,
      <>
        <Separator vertical borderColor="var(--gray7)" h="30px" />
        <ActionBarButton tooltipText="Presentation Mode" selected={viewMode === "ui"} Icon={Presentation} onPress={() => setViewMode(viewMode === "ui" ? "board" : "ui")} />
      </>,
    ],
    'uiView': [
      <ActionBarButton tooltipText="Code" selected={tabVisible == "uicode"} Icon={Code} onPress={() => generateEvent({ type: "toggle-uicode" })} />,
      <ActionBarButton tooltipText={tabVisible == "states" ? "Close States" : "Open States"} selected={tabVisible == "states"} Icon={Book} onPress={() => generateEvent({ type: "toggle-states" })} />,
      <AutopilotButton generateEvent={generateEvent} autopilot={autopilot} />,
      <>
        <Separator vertical borderColor="var(--gray8)" h="30px" ml="$2.5" />
        <ActionBarButton tooltipText="Board Mode" Icon={LayoutDashboard} onPress={() => setViewMode(viewMode === "ui" ? "board" : "ui")} />
      </>,
    ]
  }

  return isJSONView
    ? bars['JSONView']
    : viewMode === 'ui' ? bars['uiView'] : bars['BoardView'];
};

export default getActionBar;
