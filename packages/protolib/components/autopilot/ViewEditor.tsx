import { XStack } from "tamagui"
import { HTMLEditor } from "./HTMLEditor"
import { ComponentCodeGeneration } from "./ComponentCodeGeneration"
import { useSettingValue } from "protolib/lib/useSetting";
import { PanelGroup } from "react-resizable-panels";
import CustomPanelResizeHandle from "protolib/components/MainPanel/CustomPanelResizeHandle";


export const ViewEditor = ({ setHTMLCode, cardData }) => {
  const isAIEnabled = useSettingValue('ai.enabled', false);
  return <PanelGroup direction="horizontal">
    <HTMLEditor setHTMLCode={setHTMLCode} htmlCode={cardData.html} data={{ ...cardData, icon: cardData.icon, color: cardData.color, name: cardData.name, params: cardData.params }} />
    <CustomPanelResizeHandle direction="vertical" />
    {isAIEnabled ? <ComponentCodeGeneration setHTMLCode={setHTMLCode} htmlCode={cardData.html} /> : <></>}
  </PanelGroup>
}