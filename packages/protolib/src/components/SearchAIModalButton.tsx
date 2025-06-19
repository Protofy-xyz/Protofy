import { Button, Spinner, TextArea, XStack, YStack } from "@my/ui"
import { Search as IconSearch, Sparkles } from '@tamagui/lucide-icons'
import { useState, forwardRef, useRef, useEffect } from "react"
import { Tinted } from "./Tinted"
import { AlertDialog } from "./AlertDialog"
import { usePageParams } from '../next/Params'

export const SearchAIModalButton = forwardRef(({ initialState, onCancel = () => { }, onSearch = () => { }, placeholder = 'Search...', ...props }: any, ref: any) => {

    const inputRef = useRef(null)
    const [open, setOpen] = useState(false)
    const [content, setContent] = useState(initialState)
    const [loading, setLoading] = useState("")

    const { query, push, removePush } = usePageParams({})
    const isAiMode = query?.mode === 'ai'

    const onOpen = () => {
        setOpen(true)
    }

    const onToggleAI = (val) => {
        if (val === isAiMode) return

        setLoading(val ? "ai" : "search")

        if (val) {
            push("mode", "ai")
        } else {
            removePush("mode")
        }

        //foucus the input
        setTimeout(() => {
            inputRef.current?.focus()
        }, 100)
    }

    useEffect(() => {
        setLoading("")
    }, [isAiMode])

    return <>
        <XStack
            ref={ref}
            br={20}
        >
            <Button o={0.5} circular chromeless={true} onPress={onOpen} {...props}>
                <IconSearch fillOpacity={0} color="var(--color)" />
            </Button>
        </XStack>
        <AlertDialog
            open={open}
            hideAccept={true}
            setOpen={setOpen}
            overlayProps={{ o: 0.2 }}
            p={0}
            w="100%"
            maw="500px"
            jc="flex-start"
            ai="flex-start"
        >
            <YStack f={1} ai="flex-start" jc="flex-start" gap="$2" p="$2" style={{ position: "fixed", width: "100%" }}>
                <TextArea
                    ref={inputRef}
                    value={content}
                    fos={18}
                    size="$5"
                    width="100%"
                    pl="85px"
                    br="$6"
                    pt="10px"
                    height={isAiMode ? "200px" : "50px"}
                    overflow="hidden"
                    fontSize="$7"
                    borderColor="$gray8"
                    outlineColor="$gray8"
                    focusStyle={{ outlineColor: "transparent", borderColor: "$gray8" }}
                    outlineWidth={0.5}
                    borderWidth={1}
                    ac="flex-start"
                    style={{ transition: "all 0.2s ease-in-out", alignSelf: "flex-start" }}
                    placeholder={placeholder}
                    enterKeyHint="search"
                    onChangeText={(text) => {
                        setContent(text);
                        if (!text) onSearch('')
                    }}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.shiftKey) {
                            onToggleAI(true)
                        }
                        else if (e.key === 'Enter') {
                            setOpen(false)
                            onSearch(content)
                            setContent('')
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    }}
                />
                <Tinted>
                    <XStack
                        left={12}
                        top={12}
                        pos="absolute"
                    >
                        <Button
                            size="$3"
                            scaleIcon={2}
                            backgroundColor="transparent"
                            chromeless
                            circular
                            onPress={() => onToggleAI(false)}
                            hoverStyle={{ backgroundColor: "transparent" }}
                            pressStyle={{ backgroundColor: "transparent" }}
                        >
                            {loading == "search" ? <Spinner /> : <IconSearch color={!isAiMode ? "$color10" : "$gray8"} size={24} />}
                        </Button>
                        <Button
                            size="$3"
                            scaleIcon={2}
                            backgroundColor="transparent"
                            circular
                            onPress={() => onToggleAI(true)}
                            hoverStyle={{ backgroundColor: "transparent" }}
                            pressStyle={{ backgroundColor: "transparent" }}
                        >
                            {loading == "ai" ? <Spinner /> : <Sparkles color={isAiMode ? "$color10" : "$gray8"} size={24} />}
                        </Button>
                    </XStack>
                </Tinted>
            </YStack>
        </AlertDialog>
    </>
})