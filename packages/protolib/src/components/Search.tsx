import { Button, Dialog, Input, Theme, XStack, useMedia } from "tamagui"
import { Search as IconSearch } from '@tamagui/lucide-icons'
import { useState, forwardRef, useRef, useEffect } from "react"
import { useUpdateEffect } from 'usehooks-ts'
import { Tinted } from "./Tinted"

export const Search = forwardRef(({ alwaysOpen = true, automatic = false, defaultOpened, initialState, onCancel = () => { }, onSearch = () => { }, placeholder = 'Search...', ...props }: any, ref: any) => {
    const [opened, setOpened] = useState(defaultOpened ? true : false)
    const [xsOpen, setXsOpen] = useState(false)
    const input = useRef()
    const [content, setContent] = useState(initialState)
    const closedWidth = 50;

    const onOpen = () => {
        if (media.xs) {
            setXsOpen(true)
        } else {
            setOpened(true)
        }
    }

    useUpdateEffect(() => {
        if (opened) {
            //@ts-ignore
            input.current?.focus()
        } else {
            onCancel()
        }
    }, [opened])

    const media = useMedia()

    useEffect(() => {
        if (media.xs && !content) {
            setOpened(false)
        } else if (!media.xs) {
            setOpened(true)
        }
    }, [media.xs])

    //@ts-ignore
    return <>
        <XStack
            width={opened ? '500px' : closedWidth}
            $gtLg={{ width: opened ? 600 : closedWidth }}
            // $lg={{ width: opened ? 100 : closedWidth }}
            $gtMd={{ width: opened ? 500 : closedWidth }}
            $gtSm={{ width: opened ? 300 : closedWidth }}
            $sm={{ width: opened ? 200 : closedWidth }}
            onPress={onOpen}
            ref={ref}
            elevation={media.xs ? 0 : 1}
            br={20}
            {...props}
        >
            {!media.xs && <Input
                o={1}
                br={20}
                focusStyle={{ bw: 1, outlineWidth: 0 }}
                backgroundColor={media.xs ? 'transparent' : '$bgContent'}
                value={content}
                disabled={!opened}
                ref={input}
                paddingLeft={50}
                width={"100%"}
                placeholder={opened ? placeholder : ''}
                onBlur={() => ((!alwaysOpen || media.xs) && !content) ? setOpened(false) : false}
                onChangeText={(text) => {
                    setContent(text);
                    if (automatic) {
                        onSearch(text)
                    } else {
                        if (!text) onSearch('')
                    }
                }}
                bw={0}
                onSubmitEditing={(e) => { onSearch(content) }}
            />}
            <XStack position={"absolute"} left={0} top={0} $xs={{ pos: "unset", top: -20 }} cursor="pointer">
                <Tinted>
                    <Button disabled={opened} o={0.5} circular chromeless={true}>
                        <IconSearch fillOpacity={0} color="var(--color)" />
                    </Button>
                </Tinted>
            </XStack>
        </XStack>
        {media.xs && <Dialog open={xsOpen} onOpenChange={setXsOpen}>
            <Dialog.Portal>
                <Dialog.Overlay
                    opacity={0.5}
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                />
                <Dialog.Content w={'90%'} flexDirection="row" gap="$4" themeInverse>
                    <Input
                        value={content}
                        fos={18}
                        placeholder={placeholder}
                        enterKeyHint="search"
                        onChangeText={(text) => {
                            setContent(text);
                            if (automatic) {
                                onSearch(text)
                            } else {
                                if (!text) onSearch('')
                            }
                        }}
                        onSubmitEditing={(e) => {
                            setXsOpen(false)
                            onSearch(content)
                        }}
                    />
                    <Tinted>
                        <Button
                            backgroundColor="$color7"
                            icon={IconSearch}
                            scaleIcon={1.5}
                            onPress={() => {
                                setXsOpen(false)
                                onSearch(content)
                            }}
                        />
                    </Tinted>
                    <Dialog.Close />
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog>}
    </>
})