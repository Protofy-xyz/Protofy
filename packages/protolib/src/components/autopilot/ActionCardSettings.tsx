import { Cog, Text } from '@tamagui/lucide-icons'
import { YStack, XStack, Label, ToggleGroup, Input, Switch, ScrollView } from '@my/ui'
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
    <YStack space="$4" padding="$4">
      <Tinted>
        <YStack flex={1}>
          <CardSettings cardData={cardData} setCardData={setCardData} icons={icons} />
          <YStack flex={1}>

          </YStack>
        </YStack>
        <YStack mt="$3" height={600}>
          <Label mb="$-3" size={"$5"}><Cog color={"$color8"} mr="$2"></Cog>Actions</Label>
          <XStack width="100%" pt="$0" pr="$1" pb="$2" alignItems="center">
            <XStack flexBasis="33.33%" />
            <XStack flexBasis="33.33%" justifyContent="center">
              <ToggleGroup disableDeactivation={true} height="$3" type="single" value={tab} onValueChange={setTab} >
                <ToggleGroup.Item value="rules">rules</ToggleGroup.Item>
                <ToggleGroup.Item value="params">params</ToggleGroup.Item>
                <ToggleGroup.Item value="view">view</ToggleGroup.Item>
                <ToggleGroup.Item value="raw">raw</ToggleGroup.Item>
              </ToggleGroup>
            </XStack>
            <XStack flexBasis="33.33%" justifyContent="flex-end" alignItems="center">
              <Label htmlFor="autopilot-switch" mr={"$3"}>Display response</Label>
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
    </YStack>
  );
};
