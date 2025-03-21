import { Cog, Braces, Monitor, ClipboardList, Sliders } from '@tamagui/lucide-icons'
import { Text, YStack, XStack, Label, ToggleGroup, Input, Switch, ScrollView } from '@my/ui'
import { useEffect, useState } from 'react'
import { Tinted } from '../Tinted'
import { RuleEditor } from './RuleEditor'
import { ParamsEditor } from './ParamsEditor'
import { CardSettings } from './CardSettings'
import { HTMLEditor } from './HTMLEditor'
import { useThemeSetting } from '@tamagui/next-theme';
import { Monaco } from '../Monaco'

export const ActionCardSettings = ({ actions, states, card, icons, onEdit = (data) => { } }) => {
  const [cardData, setCardData] = useState(card);
  const [tab, setTab] = useState("rules");
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

  return (
    <ScrollView space="$4" padding="$4" mah={"70vh"}>
      <Tinted>
        <CardSettings cardData={cardData} setCardData={setCardData} icons={icons} />
        <YStack mt="$3" height={650}>
          <XStack width="100%" m={"$5"} mt={"$8"} jc={"center"} w={"100%"} >
            <XStack  h={"100%"}>
              {/* @ts-ignore */}
              <ToggleGroup disableDeactivation={true} height="$3" type="single" value={tab} onValueChange={setTab}>
                <ToggleGroup.Item value="rules">
                  <XStack gap={"$2"} ai={"center"}>
                    <ClipboardList size={"$1"} />
                    <Text>Actions</Text>
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
                    <Text>Raw</Text>
                  </XStack >
                </ToggleGroup.Item>
              </ToggleGroup>
            </XStack>
            <XStack pos={"absolute"}   right={30} ai={"center"}>
              <Label htmlFor="autopilot-switch" mr={"$3"}  >Display response</Label>
              <Switch
                id="autopilot-switch"
                size="$4"
                checked={cardData.displayResponse}
                onCheckedChange={(value) => {
                  setCardData({ ...cardData, displayResponse: value })
                }}
                className="no-drag"
              >
                <Switch.Thumb className="no-drag" animation="quick" />
              </Switch>
            </XStack>
          </XStack>
          <Tinted>
            {(tab == 'rules' || !tab) && <RuleEditor
              extraCompilerData={{ userParams: cardData.params, actions: actions }}
              onCodeChange={(cardData, states) => {
                return "rules processed"
              }}
              displayInput={actions}
              compiler='getActionCode'
              states={states}
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
            {tab == 'view' && <HTMLEditor setHTMLCode={setHTMLCode} htmlCode={cardData.html} data={{ ...cardData, icon: cardData.icon, color: cardData.color, name: cardData.name, params: cardData.params }} />}
            {tab == 'raw' && <Monaco
                            path={"card-" + cardData.name + ".ts"}
                            darkMode={resolvedTheme === 'dark'}
                            sourceCode={JSON.stringify(cardData, null, 2)}
                            onChange={(newCode) => {
                                try {
                                    setCardData(JSON.parse(newCode))
                                } catch (err) {
                                    console.error("Invalid JSON", err)
                                }
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
                                minimap: { enabled: false },
                                formatOnPaste: true,
                                formatOnType: true,
                            }}
                        />}

          </Tinted>

        </YStack>
        <Label size={"$5"}> <Text color={"$color8"} mr="$2" />Description</Label>
        <Input
          value={cardData.description}
          onChange={(e) =>
            setCardData({
              ...cardData,
              description: e.target.value,
            })
          }
        />
      </Tinted>
    </ScrollView>
  );
};
