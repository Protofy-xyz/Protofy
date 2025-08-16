import { YStack, Text, XStack, Tooltip, Paragraph, Dialog, Label, Input, Button } from '@my/ui';
import { Tinted } from '../Tinted';
import { Sparkles, Cog, Type, LayoutTemplate } from "@tamagui/lucide-icons";
import { BoardModel } from '@extensions/boards/boardsSchemas';
import { useRouter } from 'solito/navigation';
import { getIconUrl } from '../IconSelect';
import { ItemMenu } from '../ItemMenu';
import { useState } from 'react';
import { API, set, setErrorMap } from 'protobase';

export default ({ element, width, onDelete, ...props }: any) => {
    const board = new BoardModel(element);
    const [editSettingsDialog, seteditSettingsDialog] = useState(false);
    const [createTemplateDialog, setCreateTemplateDialog] = useState(false);
    const [selectedBoard, setSelectedBoard] = useState(null);
    const [description, setDescription] = useState('');
    const [templateName, setTemplateName] = useState(selectedBoard?.data.name);
    const router = useRouter();
    // console.log("Board", board);

    return (
        <YStack
            cursor="pointer"
            bg="$bgPanel"
            elevation={4}
            br="$4"
            width={'100%'}
            f={1}
            display="flex"
            maxWidth={width ?? 474}
            p="$4"
            gap="$4"
            {...props}
        >

            <XStack jc={"space-between"} ai={"start"} >
                <XStack gap="$2" ai={"start"} >
                    <YStack>
                        <Text fos="$8" fow="600" >{board?.get("displayName") ?? board?.get("name")}</Text>
                        <Text fos="$2" fow="600" >{board?.get("name")}</Text>
                    </YStack>
                </XStack>
                <XStack ai={"center"} >
                    <Tinted> <Sparkles color={board.get("autopilot") ? "$color8" : "$gray8"} /></Tinted>
                    <ItemMenu
                        type={"item"}
                        mt={"1px"}
                        ml={"-5px"}
                        element={board}
                        deleteable={() => true}
                        onDelete={onDelete}
                        extraMenuActions={[
                            {
                                text: "Settings",
                                icon: Cog,
                                action: (element) => { console.log("pressed: ", element); seteditSettingsDialog(true); setSelectedBoard(element) },
                                isVisible: (element) => true
                            }, {
                                text: "Create template",
                                icon: LayoutTemplate,
                                action: (element) => { console.log("pressed: ", element); setCreateTemplateDialog(true); setSelectedBoard(element) },
                                isVisible: (element) => true
                            }
                        ]}
                    />
                </XStack>
            </XStack>
            <YStack gap="$2">
                <Text fow="600">Values</Text>
                {
                    board?.get("cards")?.length
                        ? <XStack gap="$2" f={1} mah={"$9"} flexWrap="wrap" overflow="scroll">
                            {board.get("cards")?.filter(i => i).map((card: any, index: number) => (
                                <Tinted key={card.name}>
                                    <Tooltip>
                                        <Tooltip.Trigger>
                                            <YStack
                                                h={"$3"}
                                                w={"$3"}
                                                br={card.type == "action" ? "$10" : "$2"}
                                                jc={"center"}
                                                ai={"center"}
                                                bc={card.color ?? "$color6"}
                                            >
                                                <img
                                                    src={getIconUrl(card.icon)}
                                                    width={20}
                                                    height={20}
                                                />
                                            </YStack>
                                        </Tooltip.Trigger>
                                        <Tooltip.Content>
                                            <Tooltip.Arrow />
                                            <Paragraph fow="600">{card.type}</Paragraph>
                                            <Paragraph>{card.name}</Paragraph>
                                        </Tooltip.Content>
                                    </Tooltip>
                                </Tinted>
                            ))}
                        </XStack>
                        : <Text color={"$color9"}>No values</Text>
                }
            </YStack>
            <YStack gap="$2" >
                <Text fow="600">Rules</Text>
                {
                    board.get("rules")?.length
                        ?
                        <YStack gap="$3" mah={300} overflow="scroll">
                            {board.get("rules")?.map((rule: any, index: number) => (
                                <XStack key={rule} gap={"$2"}  >
                                    <YStack display='flex' w="20px" >
                                        <Text > {index + 1 + "."}</Text>
                                    </YStack>
                                    <Text>{rule}</Text>
                                </XStack>)
                            )}
                        </YStack>
                        : <Text color={"$color9"}>No rules added yet</Text>
                }
            </YStack>

            <Dialog open={createTemplateDialog} onOpenChange={setCreateTemplateDialog}>
                <Dialog.Portal className='DialogPopup'>
                    <Dialog.Overlay className='DialogPopup' />
                    <Dialog.Content overflow="hidden" p={"$8"} height={'400px'} width={"400px"} className='DialogPopup'>
                        <YStack height="100%" justifyContent="space-between">
                            <Text fos="$8" fow="600" mb="$3" className='DialogPopup'>Board Template</Text>
                            <XStack ai={"center"} className='DialogPopup'>
                                <Label ml={"$2"} h={"$3.5"} size={"$5"} className='DialogPopup'>Name</Label>
                            </XStack>
                            <Input
                                br={"8px"}
                                className='DialogPopup'
                                value={templateName}
                                // color={error ? '$red9' : null}
                                onChange={(e) => {
                                    setTemplateName(e.target.value);
                                }}
                            />

                            <XStack ai={"center"} className='DialogPopup'>
                                <Label ml={"$2"} h={"$3.5"} size={"$5"} className='DialogPopup'>Description</Label>
                            </XStack>
                            <Input
                                br={"8px"}
                                className='DialogPopup'
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                }}
                            />

                            <YStack flex={1} className='DialogPopup' />
                            <Button className='DialogPopup' onPress={async () => {
                                try {
                                    await API.post(`/api/core/v2/templates/boards`, {
                                        name: templateName,
                                        description,
                                        from: selectedBoard?.data?.name
                                    })
                                    setSelectedBoard(null);
                                    setCreateTemplateDialog(false);
                                } catch (e) {
                                    console.log('e: ', e)
                                }
                            }}>Create
                            </Button>
                        </YStack>
                        <Dialog.Close />
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog>


            <Dialog open={editSettingsDialog} onOpenChange={seteditSettingsDialog}>
                <Dialog.Portal className='DialogPopup'>
                    <Dialog.Overlay className='DialogPopup' />
                    <Dialog.Content overflow="hidden" p={"$8"} height={'400px'} width={"400px"} className='DialogPopup'>
                        <YStack height="100%" justifyContent="space-between">
                            <Text fos="$8" fow="600" mb="$3" className='DialogPopup'>Settings</Text>
                            <XStack ai={"center"} className='DialogPopup'>
                                <Label ml={"$2"} h={"$3.5"} size={"$5"} className='DialogPopup'> <Type color={"$color8"} mr="$2" />Display Name</Label>
                            </XStack>
                            <Input
                                br={"8px"}
                                className='DialogPopup'
                                value={selectedBoard?.data.displayName}
                                // color={error ? '$red9' : null}
                                onChange={(e) => {
                                    setSelectedBoard({
                                        data: {
                                            ...selectedBoard.data,
                                            displayName: e.target.value
                                        }
                                    })
                                }
                                }
                            />
                            <YStack flex={1} className='DialogPopup' />
                            <Button className='DialogPopup' onPress={async () => {
                                try {
                                    await API.post(`/api/core/v1/boards/${selectedBoard?.data?.name}`, selectedBoard.data)
                                    setSelectedBoard(null);
                                    seteditSettingsDialog(false);
                                } catch (e) {
                                    console.log('e: ', e)
                                }
                            }}>Save
                            </Button>
                        </YStack>
                        <Dialog.Close />
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog>
        </YStack>
    )
}