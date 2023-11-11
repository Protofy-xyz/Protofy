import { Popover, Stack, XStack, YStack, Text, StackProps } from "tamagui"
import { AlertDialog, API } from 'protolib'
import { useState } from "react";
import { Tinted } from "./Tinted";
import { MoreVertical, Trash2 } from '@tamagui/lucide-icons'
import { InteractiveIcon } from "./InteractiveIcon";


export const ItemMenu = ({sourceUrl='', onDelete, ...props}:{sourceUrl: string, onDelete: any} & StackProps) => {
    const [menuOpened, setMenuOpened] = useState(false)
    const [open, setOpen] = useState(false)

    return <Stack {...props}>
        <AlertDialog
            acceptCaption="Delete"
            setOpen={setOpen}
            open={open}
            onAccept={async (setOpen) => {
                if(sourceUrl) {
                    await API.get(sourceUrl + '/delete')
                }

                await onDelete(sourceUrl)
                setOpen(false)
            }}
            title={'Delete '}
            description={"Are you sure want to delete this item?"}
            w={280}
        >
            <YStack f={1} jc="center" ai="center">
                
            </YStack>
        </AlertDialog>
        <Popover onOpenChange={setMenuOpened} open={menuOpened} placement="bottom">
            <Popover.Trigger>
                <InteractiveIcon Icon={MoreVertical}  onPress={(e) => {e.stopPropagation();setMenuOpened(true)}} ml={"$3"}></InteractiveIcon>
            </Popover.Trigger>
            <Popover.Content padding={0} space={0} left={"$7"} top={"$2"} bw={1} boc="$borderColor" bc={"$color1"} >
                <Tinted>
                    <YStack alignItems="center" justifyContent="center" padding={"$3"} paddingVertical={"$3"}>
                        <XStack>
                            <XStack ml={"$1"} o={1} br={"$5"} p={"$3"} als="flex-start" cursor='pointer' pressStyle={{ o: 0.7 }} hoverStyle={{ bc: "$color5" }}
                                onPress={(e) => { e.stopPropagation(); setOpen(true); setMenuOpened(false) }}>
                                <Text mr={"$3"} >Delete</Text>
                                <Trash2 size={"$1"} color="var(--color9)" strokeWidth={2} />
                            </XStack>
                        </XStack>
                    </YStack>
                </Tinted>
            </Popover.Content>
        </Popover>
    </Stack>
}