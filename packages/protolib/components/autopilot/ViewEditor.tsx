import { XStack } from "tamagui"
import { HTMLEditor } from "./HTMLEditor"
import { ComponentCodeGeneration } from "./ComponentCodeGeneration"
import { useSettingValue } from "protolib/lib/useSetting";

export const ViewEditor = ({ setHTMLCode, cardData }) => {
  const isAIEnabled = useSettingValue('ai.enabled', false);
  return <XStack flex={1} gap="$2">
    <HTMLEditor setHTMLCode={setHTMLCode} htmlCode={cardData.html} data={{ ...cardData, icon: cardData.icon, color: cardData.color, name: cardData.name, params: cardData.params }} />
    {/* <YStack width={"450px"} height={"100%"} bg="$gray3" borderRadius="$3" p="$3"> */}
    {isAIEnabled ? <ComponentCodeGeneration setHTMLCode={setHTMLCode} htmlCode={cardData.html} /> : <></>}
  </XStack>
}