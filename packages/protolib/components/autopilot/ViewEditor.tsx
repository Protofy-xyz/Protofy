import { XStack } from "tamagui"
import { HTMLEditor } from "./HTMLEditor"
import { ComponentCodeGeneration } from "./ComponentCodeGeneration"
import { useSettingValue } from "@extensions/settings/hooks";
import { Panel, PanelGroup } from "react-resizable-panels";
import CustomPanelResizeHandle from "protolib/components/MainPanel/CustomPanelResizeHandle";


export const ViewEditor = ({ setHTMLCode, cardData }) => {
  const isAIEnabled = useSettingValue('ai.enabled', false);
  return <PanelGroup direction="horizontal">
    <Panel defaultSize={75}>
      <HTMLEditor setHTMLCode={setHTMLCode} htmlCode={cardData.html} data={{ ...cardData, icon: cardData.icon, color: cardData.color, name: cardData.name, params: cardData.params }} />
    </Panel>
    <CustomPanelResizeHandle direction="vertical" />
    {isAIEnabled ? <Panel defaultSize={25} minSize={25}><ComponentCodeGeneration setHTMLCode={setHTMLCode} htmlCode={cardData.html} /></Panel> : <></>}
  </PanelGroup>
}