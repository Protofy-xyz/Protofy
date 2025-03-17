import { Cog, Text } from '@tamagui/lucide-icons'
import { YStack, XStack, Label, ToggleGroup, Input } from '@my/ui'
import { useEffect, useState } from 'react'
import { Tinted } from '../Tinted'
import { RuleEditor } from './RuleEditor'
import { ParamsEditor } from './ParamsEditor'
import { CardSettings } from './CardSettings'

export const ActionCardSettings = ({ actions, states, card, icons, onEdit = (data) => { } }) => {
  const [cardData, setCardData] = useState(card);
  const [tab, setTab] = useState("rules");
  useEffect(() => {
    onEdit(cardData);
  }, [cardData, onEdit]);

  return (
    <YStack space="$4" padding="$4">
      <Tinted>
        <YStack flex={1}>
          <CardSettings cardData={cardData} setCardData={setCardData} icons={icons} />
          <YStack flex={1}>
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
          </YStack>
        </YStack>
        <YStack mt="$5" height={600}>
          <Label mb="$-3" size={"$5"}><Cog color={"$color8"} mr="$2"></Cog>Actions</Label>
          <XStack width={"100%"} pt="$0" pr="$1" pb="$2" jc="center">
            <ToggleGroup disableDeactivation={true} height="$3" type="single" value={tab} onValueChange={setTab}>
              <ToggleGroup.Item value="rules">rules</ToggleGroup.Item>
              <ToggleGroup.Item value="params">params</ToggleGroup.Item>
            </ToggleGroup>
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
              params={cardData.params || []}
              setParams={(newParams) =>
                setCardData({ ...cardData, params: newParams })
              }
            />}
          </Tinted>

        </YStack>
      </Tinted>
    </YStack>
  );
};
