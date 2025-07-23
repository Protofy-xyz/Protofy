import { YStack, XStack, Spacer, ScrollView, useThemeName, Input, Text, Button } from '@my/ui'
import { AlertDialog } from '../../components/AlertDialog';
import { Slides } from '../../components/Slides'
import { useEffect, useMemo, useState } from 'react';
import { ActionCardSettings } from '../autopilot/ActionCardSettings';
import { useProtoStates } from '@extensions/protomemdb/lib/useProtoStates'
import { Search, ScanEye, Rocket } from "@tamagui/lucide-icons";
import { Tinted } from '../Tinted';
import { getIconUrl } from '../IconSelect';

const SelectGrid = ({ children }) => {
  return <XStack jc="flex-start" ai="center" gap={25} flexWrap='wrap'>
    {children}
  </XStack>
}

const FirstSlide = ({ selected, setSelected, options }) => {
  const themeName = useThemeName()
  const [search, setSearch] = useState('')
  const isAction = (option) => option.defaults?.type === 'action'
  const [selectedGroups, setSelectedGroups] = useState([]);

  // Extrae los grupos disponibles de las options
  const groups = useMemo(() => {
    return [...new Set(options.map(o => o.group).filter(Boolean))];
  }, [options]);

  const toggleGroup = (group) => {
    setSelectedGroups((prev) =>
      prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
    );
  };

  const filteredOptions = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return options.filter(opt => {
      const matchSearch = opt.name?.toLowerCase().includes(lowerSearch);
      const matchGroup = selectedGroups.length === 0 || selectedGroups.includes(opt.group);
      return matchSearch && matchGroup;
    });
  }, [options, search, selectedGroups]);

  const groupedOptions = useMemo(() => {
    return filteredOptions.reduce((acc, opt) => {
      const groupKey = opt.group ?? "__no_group__";
      if (!acc[groupKey]) acc[groupKey] = [];
      acc[groupKey].push(opt);
      return acc;
    }, {});
  }, [filteredOptions]);

  return (
    <YStack>
      <Tinted>
        <XStack pb={8} mt={-15} mb={15} position="relative">

          <Search pos="absolute" left="$3" top={14} size={16} pointerEvents="none" />
          <Input
            bg="$gray3"
            color="$gray12"
            paddingLeft="$7"
            bw={themeName === 'dark' ? 0 : 1}
            h="47px"
            boc={'$gray5'}
            w="100%"
            placeholder="search..."
            placeholderTextColor="$gray9"
            outlineColor="$gray8"
            value={search}
            onChangeText={setSearch}
          />
        </XStack>
        <XStack gap="$2" mb="$4" flexWrap="wrap">
          {groups.map((group) => {
            const isActive = selectedGroups.includes(group);
            return (
              <Button
                key={group}
                onPress={() => toggleGroup(group)}
                style={{
                  backgroundColor: isActive ? 'var(--color4)' : 'var(--gray3)',
                  borderColor: isActive ? 'var(--color7)' : 'var(--gray5)',
                  borderWidth: '1px',
                  color: isActive ? 'white' : 'inherit',
                }}
              >
                {group}
              </Button>
            );
          })}
        </XStack>

        <ScrollView mah="800px">
          {Object.entries(groupedOptions).map(([group, options]) => (
            <YStack key={group} mb="$3">
              {group !== "__no_group__" && (
                <>
                  <Text fontSize="$5" fontWeight="600" mb="$2">{group}</Text>
                  <YStack height="1px" bg="$gray6" mb="$3" />
                </>
              )}

              <SelectGrid>
                {options.map((option) => (
                  <XStack
                    w={420}
                    key={option.id}
                    gap={"$2"}
                    p={"$2"}
                    cursor="pointer"
                    onPress={() => setSelected(option)}
                    borderRadius={"$3"}
                    ai="center"
                    bc={selected?.id === option.id ? "$color4" : "$gray3"}
                    bw={"1px"}
                    boc={selected?.id === option.id ? "$color7" : "$gray5"}
                    hoverStyle={{ bc: "$color4", boc: "$color7" }}
                  >
                    <YStack
                      br={isAction(option) ? "$10" : "$2"}
                      p={"$2"}
                      bc={
                        option?.defaults?.color
                          ? option?.defaults?.color
                          : isAction(option)
                            ? "$yellow7"
                            : "$blue7"
                      }
                    >
                      {option?.defaults?.icon ? (
                        <img src={getIconUrl(option.defaults.icon)} width={20} height={20} />
                      ) : isAction(option) ? (
                        <Rocket />
                      ) : (
                        <ScanEye />
                      )}
                    </YStack>
                    <Text fow={selected?.id === option.id && "600"}>{option.name}</Text>
                  </XStack>
                ))}
              </SelectGrid>
            </YStack>
          ))}
        </ScrollView>
        <Spacer marginBottom="$8" />
      </Tinted>
    </YStack>
  )
}


const iconTable = {
  'value': 'tag',
  'action': 'zap'
}

const SecondSlide = ({ card, board, selected, states, icons, actions, setCard, errors }) => {
  return <YStack mb={"$4"} f={1} mah="1200px" h="64vh">

    <ActionCardSettings board={board} states={states} icons={icons} card={card} actions={actions} onEdit={(data) => {
      setCard(data)
    }} errors={errors} />
  </YStack>
}

const typeCodes = {
  value: `
//data contains: data.value, data.icon and data.color
return card({
    content: \`
        \${cardIcon({ data, size: '48' })}    
        \${cardValue({ value: data.value })}
    \`
});
`,
  action: `
// data contains: data.icon, data.color, data.name, data.params
reactCard(\`
  function Widget(props) {
    const value = props.value;
    const fullHeight = value !== undefined && typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean";

    return (
        <Tinted>
          <ProtoThemeProvider forcedTheme={window.TamaguiTheme}>
            <ActionCard data={props}>
              <YStack f={fullHeight ? 1 : undefined}  mt={fullHeight ? "20px" : "0px"} ai="center" jc="center" width="100%">
                  {props.icon && props.displayIcon !== false && (
                      <Icon name={props.icon} size={48} color={props.color}/>
                  )}
                  {props.displayResponse !== false && (
                      <CardValue value={value ?? "N/A"} />
                  )}
              </YStack>
            </ActionCard>
          </ProtoThemeProvider>
        </Tinted>
    );
  }

\`, data.domId, data)

`
}

const extraCards = [
  {
    defaults: {
      type: 'action',
      name: 'card',
      displayResponse: true
    },
    name: 'Action card',
    id: 'action'
  }
  , {
    defaults: {
      type: 'value',
      name: 'value'
    },
    name: 'Observer card',
    id: 'value'
  }]

function flattenTree(obj, currentGroup = null) {
  let leaves = [];

  function traverse(node, group) {
    if (node && typeof node === 'object') {
      if (node.name) {
        leaves.push({ ...node, group: group }); // añade el grupo a cada hoja
      } else {
        for (const [key, value] of Object.entries(node)) {
          traverse(value, group ?? key); // el primer nivel se considera grupo
        }
      }
    }
  }

  traverse(obj, currentGroup);
  return leaves;
}

const useCards = (extraCards = []) => {
  const availableCards = useProtoStates({}, 'cards/#', 'cards')
  console.log('availableCards', availableCards)
  return [...extraCards, ...flattenTree(availableCards)]
}

export const CardSelector = ({ defaults = {}, board, addOpened, setAddOpened, onFinish, states, icons, actions, errors }) => {
  const cards = useCards(extraCards)
  const [selectedCard, setSelectedCard] = useState(cards[0])
  const [card, setCard] = useState()

  useEffect(() => {
    if (selectedCard) {
      setCard({ key: "key", width: selectedCard.defaults.type === 'value' ? 1 : 2, height: selectedCard.defaults.type === 'value' ? 4 : 6, icon: iconTable[selectedCard.defaults.type], html: typeCodes[selectedCard.defaults.type], ...selectedCard.defaults })
    } else {
      setCard(undefined)
    }
  }, [selectedCard])
  return <AlertDialog
    integratedChat
    p={"$2"}
    pt="$5"
    pl="$5"
    setOpen={setAddOpened}
    open={addOpened}
    onFinish={() => setCard(undefined)}
    hideAccept={true}
    description={""}
  >
    <YStack f={1} jc="center" ai="center" >
      <XStack mr="$5">
        <Slides
          styles={{ w: "90vw", maw: 1400, h: "90vh", mah: 1200 }}
          lastButtonCaption="Create"
          onFinish={async () => {
            try {
              await onFinish(card)
              setAddOpened(false)
            } catch (e) {
              console.error("Error creating card: ", e)
            }
          }}
          slides={[
            {
              name: "Create new widget",
              title: "Select the widget",
              component: <FirstSlide options={cards} selected={selectedCard} setSelected={setSelectedCard} />
            },
            {
              name: "Configure your widget",
              title: "Configure your widget",
              component: <SecondSlide board={board} states={states} icons={icons} actions={actions} card={card} setCard={setCard} errors={errors} />
            }
          ]
          }></Slides>
      </XStack>
      {/* </ScrollView> */}
    </YStack>
  </AlertDialog>
}