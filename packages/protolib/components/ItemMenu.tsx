import { Popover, Stack, XStack, YStack, Text, StackProps } from "tamagui"
import { AlertDialog, API } from 'protolib'
import { useContext, useState } from "react";
import { Tinted } from "./Tinted";
import { MoreVertical, Trash2, FilePlus } from '@tamagui/lucide-icons'
import { InteractiveIcon } from "./InteractiveIcon";
import { DataViewContext } from "./DataView";

export const ItemMenu = ({ sourceUrl = '', enableAddToInitialData=false ,onDelete, element, extraMenuActions = [], ...props }: { sourceUrl: string, enableAddToInitialData?:boolean, onDelete: any, element: any, extraMenuActions?: any } & StackProps) => {
    const [menuOpened, setMenuOpened] = useState(false)
    const [open, setOpen] = useState(false)
    const { setSelected} = useContext(DataViewContext);

    const addToInitialData = ({data}) =>{
        
    }

    const MenuButton = ({ text, Icon, onPress }) => {
        return <XStack ml={"$1"} o={1} br={"$5"} p={"$3"} als="flex-start"
            cursor='pointer'
            pressStyle={{ o: 0.7 }}
            hoverStyle={{ bc: "$color5" }}
            onPress={(e) => { onPress(element, e), setMenuOpened(false) }}>
            <Icon size={"$1"} color="var(--color9)" strokeWidth={2} />
            <Text ml={"$3"}>{text}</Text>
        </XStack>
    }

    return <Stack {...props}>
        <AlertDialog
            acceptCaption="Delete"
            setOpen={setOpen}
            open={open}
            onAccept={async (setOpen) => {
                if (Array.isArray(element) && sourceUrl) {
                    const deletePromises = element.map(ele => API.get(sourceUrl + "/" + ele + '/delete'));
                    await Promise.all(deletePromises);
                    setSelected([]);
                } else if (sourceUrl) {
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
                <InteractiveIcon Icon={MoreVertical} onPress={(e) => { e.stopPropagation(); setMenuOpened(true) }} ml={"$3"}></InteractiveIcon>
            </Popover.Trigger>
            <Popover.Content padding={0} space={0} left={"$7"} top={"$2"} bw={1} boc="$borderColor" bc={"$color1"} >
                <Tinted>
                    <YStack alignItems="center" justifyContent="center" padding={"$3"} paddingVertical={"$3"} onPress={(e) => e.stopPropagation()}>
                        <YStack>
                            {extraMenuActions.map((action) => {
                                return action.isVisible && action.isVisible(element) && <MenuButton text={action.text} Icon={action.icon} onPress={action.action}></MenuButton>
                            })}
                            {false && enableAddToInitialData &&  <MenuButton text={"Add to initial data"} Icon={FilePlus} onPress={(data, e) => { e.stopPropagation(); addToInitialData(data),setMenuOpened(false) }}></MenuButton>}
                            <MenuButton text={"Delete"} Icon={Trash2} onPress={(data, e) => { e.stopPropagation(); setOpen(true); setMenuOpened(false) }}></MenuButton>
                        </YStack>
                    </YStack>
                </Tinted>
            </Popover.Content>
        </Popover>
    </Stack>
}