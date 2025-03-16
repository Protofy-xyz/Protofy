import { BookOpenText, ExternalLink, Cog, Palette, Type } from '@tamagui/lucide-icons'
import { YStack, XStack, Input, Label, ToggleGroup } from '@my/ui'
import { useEffect, useState } from 'react'
import { Tinted } from '../Tinted'
import { InputColor } from '../InputColor'
import { RuleEditor } from './RuleEditor'
import { InteractiveIcon } from '../InteractiveIcon'
import { IconSelect } from '../IconSelect'
import { ParamsEditor } from './ParamsEditor'

export const ActionCardSettings = ({ actions, states, card, icons, onEdit = (data) => { } }) => {
  const [cardData, setCardData] = useState(card);
  const [tab, setTab] = useState("rules");
  useEffect(() => {
    onEdit(cardData);
  }, [cardData, onEdit]);

  return (
    <YStack space="$4" padding="$4">
      <Tinted>
        <XStack alignItems="center" space="$8" width="100%">
          <YStack flex={1}>
            <Label size={"$5"}> <Type color={"$color8"} mr="$2" />Name</Label>
            <Input
              value={cardData.name}
              onChange={(e) =>
                setCardData({
                  ...cardData,
                  name: e.target.value,
                })
              }
            />
          </YStack>
          <YStack flex={1}>
            <XStack alignItems="center" space="$2">
              <Label size={"$5"}><BookOpenText color={"$color8"} mr="$2" />Icon</Label>

            </XStack>
            <XStack alignItems="center" space="$2">
              <a href="https://lucide.dev/icons/" target="_blank" rel="noreferrer">
                <InteractiveIcon Icon={ExternalLink}></InteractiveIcon>
              </a>
              <IconSelect
                icons={icons}
                onSelect={(icon) => {
                  setCardData({
                    ...cardData,
                    icon,
                  });
                }}
                selected={cardData.icon}
              />
            </XStack>

          </YStack>
          <YStack flex={1}>
            <Label size={"$5"}><Palette color={"$color8"} mr="$2" />Color</Label>
            <InputColor
              color={cardData.color}
              onChange={(e) =>
                setCardData({ ...cardData, color: e.hex })
              }
            />
          </YStack>
        </XStack>

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
            {tab == 'params' && <ParamsEditor />}
          </Tinted>

        </YStack>
      </Tinted>
    </YStack>
  );
};
