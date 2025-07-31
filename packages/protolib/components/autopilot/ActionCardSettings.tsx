import { Braces, Monitor, ClipboardList, Sliders, FileCode, Info } from '@tamagui/lucide-icons'
import { Text, YStack, XStack, ToggleGroup, Paragraph, Input, Button } from '@my/ui'
import { useEffect, useState } from 'react'
import { Tinted } from '../Tinted'
import { RuleEditor } from './RuleEditor'
import { ParamsEditor } from './ParamsEditor'
import { CardSettings } from './CardSettings'
import { HTMLEditor } from './HTMLEditor'
import { useThemeSetting } from '@tamagui/next-theme';
import { Monaco } from '../Monaco'
import { Markdown } from '../Markdown'
import { Panel, PanelGroup } from "react-resizable-panels";
import CustomPanelResizeHandle from "../MainPanel/CustomPanelResizeHandle";
import { SettingsEditor } from './SettingsEditor'
import { ComponentCodeGeneration } from './ComponentCodeGeneration'
import { ViewEditor } from './ViewEditor'

export const ActionCardSettings = ({ board, actions, states, card, icons, onEdit = (data) => { }, errors }) => {
  const [cardData, setCardData] = useState(card);
  const isSimpleReturnString =
    !cardData.rulesCode ||
    /^return\s*`[\s\S]*`$/.test(cardData.rulesCode.trim());
  const hasEmptyRulesCode = !cardData.rulesCode
  //if there is rules code and it is a simple return string, we show the value tab by default, otherwise we show the rules tab
  const [tab, setTab] = useState(!hasEmptyRulesCode && isSimpleReturnString ? "value" : "rules");

  const { resolvedTheme } = useThemeSetting();
  useEffect(() => {
    onEdit(cardData);
  }, [cardData, onEdit]);

  const setHTMLCode = (code) => {
    setCardData({
      ...cardData,
      html: code,
    })
  }

  console.log("ActionCardSettings board: ", board)

  return (
    <YStack f={1}>
      <Tinted>
        <CardSettings cardData={cardData} setCardData={setCardData} icons={icons} />

        <YStack mt="$2" f={1}>
          <XStack width="100%" mb="$2" mt={"$2"} jc={"center"} w={"100%"} >
            <XStack h={"100%"}>
              {/* @ts-ignore */}
              <ToggleGroup disableDeactivation={true} height="$3" type="single" value={tab} onValueChange={setTab}>
                <ToggleGroup.Item value="info">
                  <XStack gap={"$2"} ai={"center"}>
                    <Info size={"$1"} />
                    <Text>Readme</Text>
                  </XStack >
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  value="value"
                  disabled={!isSimpleReturnString}
                  opacity={!isSimpleReturnString ? 0.4 : 1}
                >
                  <XStack gap="$2" ai="center">
                    <ClipboardList size="$1" />
                    <Text color={!isSimpleReturnString ? '$color8' : '$color'}>
                      Value
                    </Text>
                  </XStack>
                </ToggleGroup.Item>
                <ToggleGroup.Item value="rules">
                  <XStack gap={"$2"} ai={"center"}>
                    <FileCode size={"$1"} />
                    <Text>Rules</Text>
                  </XStack >
                </ToggleGroup.Item>
                <ToggleGroup.Item value="params">
                  <XStack gap={"$2"} ai={"center"}>
                    <Sliders size={"$1"} />
                    <Text>Params</Text>
                  </XStack >
                </ToggleGroup.Item>
                <ToggleGroup.Item value="view">
                  <XStack gap={"$2"} ai={"center"}>
                    <Monitor size={"$1"} />
                    <Text>Display</Text>
                  </XStack >
                </ToggleGroup.Item>
                <ToggleGroup.Item value="raw">
                  <XStack gap={"$2"} ai={"center"}>
                    <Braces size={"$1"} />
                    <Text>Settings</Text>
                  </XStack >
                </ToggleGroup.Item>
              </ToggleGroup>
            </XStack>
          </XStack>
          <Tinted>
            {tab == 'info' &&
              <PanelGroup direction="horizontal">
                <Panel defaultSize={50}>
                  <YStack
                    flex={1} height="100%" backgroundColor="$gray3" borderRadius="$3" p="$3" >
                    <Markdown data={cardData.description} />
                  </YStack>
                </Panel>
                <CustomPanelResizeHandle direction="vertical" />
                <Panel defaultSize={50}>
                  <YStack
                    flex={1} height="100%" alignItems="center" justifyContent="center" backgroundColor="$gray3" borderRadius="$3" p="$2" >

                    <Monaco
                      path={cardData.name + '_description.md'}
                      darkMode={resolvedTheme === 'dark'}
                      sourceCode={cardData.description}
                      onChange={(newCode) => {
                        setCardData({
                          ...cardData,
                          description: newCode
                        })
                      }}
                      options={{
                        folding: false,
                        lineDecorationsWidth: 15,
                        lineNumbersMinChars: 0,
                        lineNumbers: true,
                        minimap: { enabled: false }
                      }}
                    />
                  </YStack>
                </Panel>
              </PanelGroup>
            }

            {tab == 'value' && <Monaco
              colors={{ 'editor.background': resolvedTheme === 'dark' ? '#1E1E1E' : '#FFFFFF' }}
              path={"value-" + cardData.name + ".ts"}
              darkMode={resolvedTheme === 'dark'}
              sourceCode={
                (cardData.rulesCode?.trim().startsWith('return `') && cardData.rulesCode?.trim().endsWith('`'))
                  ? cardData.rulesCode.trim().slice(8, -1)
                  : cardData.rulesCode || ''
              }
              onChange={(newCode) => {
                setCardData({
                  ...cardData,
                  rulesCode: `return \`${newCode}\``
                })
              }}
              options={{
                scrollBeyondLastLine: false,
                scrollbar: {
                  vertical: 'auto',
                  horizontal: 'auto',
                },
                folding: false,
                lineDecorationsWidth: 0,
                lineNumbersMinChars: 0,
                lineNumbers: "off",
                minimap: { enabled: false },
                formatOnPaste: true,
                formatOnType: true,
              }}
            />}
            {(tab == 'rules' || !tab) && <RuleEditor
              board={board}
              extraCompilerData={{ userParams: cardData.params, actions: actions }}
              onCodeChange={(cardData, states) => {
                return "rules processed"
              }}
              actions={actions.boards || {}}
              compiler={cardData.type == 'value' ? 'getValueCode' : 'getActionCode'}
              states={states?.boards || {}}
              cardData={cardData}
              setCardData={setCardData}
            />}
            {tab == 'params' && <ParamsEditor
              params={cardData.params || {}}
              setParams={(newParams) => {
                console.log("hacemos setParams", newParams)
                setCardData((prev) => ({
                  ...prev,
                  params: newParams,
                }))
              }}
              configParams={cardData.configParams || {}}
              setConfigParams={(newConfigParams) => {
                console.log("hacemos setConfigParams", newConfigParams)
                setCardData((prev) => ({
                  ...prev,
                  configParams: newConfigParams,
                }))
              }}
            />}
            {tab == 'view' && <ViewEditor cardData={cardData} setHTMLCode={setHTMLCode} />}
            {tab === 'raw' && <SettingsEditor card={card} cardData={cardData} setCardData={setCardData} resolvedTheme={resolvedTheme} />}
          </Tinted>

        </YStack>
      </Tinted >
      {errors?.length > 0 ?
                <YStack>
                  {errors.map((error, index) => (
                    <Paragraph key={"err" + index} color="$red9" fontSize="$4">{error}</Paragraph>
                  ))}
                </YStack>
                : <></>
              }
    </YStack >
  );
};
