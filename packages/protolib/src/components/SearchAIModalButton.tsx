import { Button, Spinner, TextArea, XStack, YStack } from "@my/ui"
import { Search as IconSearch, Sparkles } from '@tamagui/lucide-icons'
import { useState, forwardRef, useRef, useEffect, useContext } from "react"
import { Tinted } from "./Tinted"
import { AlertDialog } from "./AlertDialog"
import { usePageParams } from '../next/Params'
import { SearchContext } from "../context/SearchContext"
import { useSettingValue } from "../lib/useSetting";

export const SearchAIModalButton = forwardRef(({ initialState, onCancel = () => { }, onSearch = () => { }, placeholder = 'Search...', ...props }: any, ref: any) => {

    const isAIEnabled = useSettingValue('ai.enabled', false);
    const inputRef = useRef(null)
    const [open, setOpen] = useState(false)
    const [content, setContent] = useState(initialState)
    const [loading, setLoading] = useState("")

    const { search, searchStatus } = useContext(SearchContext)
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

    useEffect(() => {
        if (!searchStatus && search) {
            setOpen(false)
            setContent('')
        }
    }, [searchStatus])

    return <>
        <XStack
            ref={ref}
            br={20}
        >
            <YStack onPress={onOpen}>
                {props.trigger ?? <Button o={0.5} circular chromeless={true} {...props}>
                    <IconSearch fillOpacity={0} color="var(--color)" />
                </Button>}
            </YStack>
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
            <YStack
                f={1}
                ai="flex-start"
                jc="flex-start"
                gap="$2"
                br="$6"
                style={{ position: "fixed", width: "100%", top: "-200px", boxShadow: "rgba(0, 0, 0, 0.1) 0 1px 10px" }}
            >
                <TextArea
                    ref={inputRef}
                    value={content}
                    fos={18}
                    size="$5"
                    width="100%"
                    pl={isAIEnabled ? "85px": "50px"}
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
                    disabled={!!(loading || searchStatus === "loading")}
                    color={searchStatus == "loading" ? "$gray11" : "$color"}
                    onChangeText={(text) => {
                        setContent(text);
                        if (!text) onSearch('')
                    }}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.shiftKey) {
                            onToggleAI(true)
                        }
                        else if (e.key === 'Enter') {
                            onSearch(content)
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    }}
                />
                <Tinted>
                    <XStack
                        left={7}
                        top={7}
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
                            {loading == "search" || searchStatus == "loading" ? <Spinner /> : <IconSearch color={!isAiMode ? "$color10" : "$gray8"} size={24} />}
                        </Button>
                        {isAIEnabled &&<Button
                            size="$3"
                            scaleIcon={2}
                            backgroundColor="transparent"
                            circular
                            onPress={() => onToggleAI(true)}
                            hoverStyle={{ backgroundColor: "transparent" }}
                            pressStyle={{ backgroundColor: "transparent" }}
                        >
                            {loading == "ai" ? <Spinner /> : <Sparkles color={isAiMode ? "$color10" : "$gray8"} size={24} />}
                        </Button>}
                    </XStack>
                </Tinted>
            </YStack>
        </AlertDialog>
    </>
})