import { Braces, Monitor, ClipboardList, Sliders, FileCode, Info, HelpingHand, X } from '@tamagui/lucide-icons'
import { Text, YStack, XStack, ToggleGroup, Paragraph, Input, Button, Label } from '@my/ui'
import { useEffect, useState, useRef } from 'react'
import { Tinted } from '../Tinted'
import { RuleEditor } from './RuleEditor'
import { ParamsEditor } from './ParamsEditor'
import { CardSettings, SettingsTitle } from './CardSettings'
import { HTMLEditor } from './HTMLEditor'
import { useThemeSetting } from '@tamagui/next-theme';
import { Monaco } from '../Monaco'
import { Markdown } from '../Markdown'
import { Panel, PanelGroup } from "react-resizable-panels";
import CustomPanelResizeHandle from "../MainPanel/CustomPanelResizeHandle";
import { SettingsEditor } from './SettingsEditor'
import { ViewEditor } from './ViewEditor'
import { DisplayEditor } from './DisplayEditor'

export const ActionCardSettings = ({ board, actions, states, card, icons, onEdit = (data) => { }, errors, mode = "edit" }) => {
  const [cardData, setCardData] = useState(card);
  const originalNameRef = useRef(card?.name ?? null)

  const isSimpleReturnString =
    !cardData.rulesCode ||
    /^return\s*`[\s\S]*`$/.test(cardData.rulesCode.trim());
  const hasEmptyRulesCode = !cardData.rulesCode
  const isCreateMode = mode === "create";
  //if there is rules code and it is a simple return string, we show the value tab by default, otherwise we show the rules tab
  const [selectedTab, setSelectedTab] = useState(isCreateMode ? "info" : !hasEmptyRulesCode && isSimpleReturnString ? "value" : "rules");

  const { resolvedTheme } = useThemeSetting();
  useEffect(() => {
    const payload = { ...cardData }
    const original = originalNameRef.current
    if (!isCreateMode && original && payload?.name && payload.name !== original) {
      payload.previousName = original
    } else {
      delete payload.previousName
    }
    onEdit(payload);
  }, [cardData, onEdit, isCreateMode]);


  const setHTMLCode = (code) => {
    setCardData({
      ...cardData,
      html: code,
    })
  }

  const tabs = [
    {
      id: 'info',
      label: 'Info',
      icon: <Info size={"$1"} />,
      content: <YStack f={1} gap="$4">
        <CardSettings cardData={cardData} setCardData={setCardData} />
        <YStack f={1} gap="$2">
          <SettingsTitle>Description</SettingsTitle>
          <PanelGroup direction="horizontal">
            {!isCreateMode && <Panel defaultSize={50}>
              <YStack
                flex={1} height="100%" backgroundColor="$gray3" borderRadius="$3" p="$3" >
                <Markdown data={cardData.description} />
              </YStack>
            </Panel>}
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
        </YStack>
      </YStack>
    },
    {
      id: 'value',
      label: 'Value',
      icon: <HelpingHand size={"$1"} />,
      disabled: !isSimpleReturnString,
      opacity: !isSimpleReturnString ? 0.4 : 1,
      content: <Monaco
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
      />
    },
    {
      id: 'rules',
      label: 'Rules',
      icon: <ClipboardList size={"$1"} />,
      content: <RuleEditor
        board={board}
        extraCompilerData={{ userParams: cardData.params, actions: actions?.boards?.[board.name] }}
        onCodeChange={(cardData, states) => {
          return "rules processed"
        }}
        actions={actions.boards || {}}
        compiler={cardData.type == 'value' ? 'getValueCode' : 'getActionCode'}
        states={states?.boards || {}}
        cardData={cardData}
        setCardData={setCardData}
      />
    },
    {
      id: 'params',
      label: 'Params',
      icon: <Sliders size={"$1"} />,
      content: <ParamsEditor
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
      />
    },
    {
      id: 'display',
      label: 'Display',
      icon: <Monitor size={"$1"} />,
      content: <DisplayEditor icons={icons} card={card} cardData={cardData} setCardData={setCardData} />
    },
    {
      id: 'view',
      label: 'View',
      icon: <FileCode size={"$1"} />,
      content: <ViewEditor cardData={cardData} setHTMLCode={setHTMLCode} />
    },
    {
      id: 'raw',
      label: 'Raw',
      icon: <Braces size={"$1"} />,
      content: <SettingsEditor cardData={cardData} setCardData={setCardData} resolvedTheme={resolvedTheme} />
    }
  ]

  return (
    <YStack f={1}>
      <Tinted>
        <YStack f={1}>
          <XStack borderBottomColor="$gray6" borderBottomWidth="1px">
            {
              tabs.map((tab, index) => {
                const isSelected = selectedTab === tab.id;
                return <XStack
                  key={index}
                  onPress={() => setSelectedTab(tab.id)}
                  cursor={tab.disabled ? "default" : "pointer"}
                  paddingVertical="$2.5"
                  paddingHorizontal="$4"
                  disabled={tab.disabled}
                  style={{
                    boxShadow: isSelected
                      ? '0px 2px 0px var(--color8)'
                      : 'none',
                    transition: 'box-shadow 0.2s ease'
                  }}
                  justifyContent="center"
                  gap="$2"
                  alignItems="center"
                  opacity={isSelected ? 1 : !tab.disabled ? 0.6 : 0.2}
                  hoverStyle={{ opacity: tab.disabled ? null : 0.9 }}
                >
                  {tab.icon}
                  <Text fontSize="$4">
                    {tab.label}
                  </Text>
                </XStack>
              })
            }
          </XStack>
          <Tinted>
            {
              tabs.map((tabItem) => (
                tabItem.id === (selectedTab ?? "rules") && (
                  <YStack key={tabItem.id} f={1} gap="$4" p="$4">
                    {tabItem.content || (
                      <YStack f={1} ai="center" jc="center">
                        <Text color="$gray11">No content available for this tab</Text>
                      </YStack>
                    )}
                  </YStack>
                )
              ))
            }

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
