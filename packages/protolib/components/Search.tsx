import { Button, Input, Theme, XStack } from "tamagui"
import { Search as IconSearch } from '@tamagui/lucide-icons'
import { useState, forwardRef, useRef, useEffect } from "react"
import { useUpdateEffect } from 'usehooks-ts'
import { Tinted } from "./Tinted"

export const Search = forwardRef(({ alwaysOpen=true, automatic = false, defaultOpened, initialState, onCancel = () => { }, onSearch = () => { }, placeholder = 'Search...', width = 600, widthmd = 400, closedWidth = 50, ...props }: any, ref: any) => {
    const [opened, setOpened] = useState(defaultOpened ? true : false)
    const input = useRef()
    const [content, setContent] = useState(initialState)

    useUpdateEffect(() => {
        if (opened) {
            //@ts-ignore
            input.current?.focus()
        } else {
            onCancel()
        }
    }, [opened])


    //@ts-ignore
    return <XStack
        width={opened ? width : closedWidth}
        $md={{ width: opened ? widthmd : closedWidth }}
        $sm={{ width: opened ? '100%' : closedWidth }}
        onPress={() => setOpened(true)}
        ref={ref}
        elevation={1}
        br={20}
        {...props}
    >
        {opened ? <Input
            o={1}
            br={20}
            focusStyle={{bw:1,outlineWidth: 0}}
            backgroundColor={'$color1'}
            value={content}
            disabled={!opened}
            //@ts-ignore
            ref={input}
            paddingLeft={50}
            width={opened ? "100%" : closedWidth}
            placeholder={opened ? placeholder : ''}
            onBlur={() => (!alwaysOpen && !content) ? setOpened(false) : false}
            onChangeText={(text) => { 
                setContent(text); 
                if(automatic) {
                    onSearch(text)
                } else{
                    if (!text) onSearch('') 
                }
            }}
            bw={0}
            onSubmitEditing={(e) => { onSearch(content) }}
        /> : null}
        <XStack position={"absolute"} left={0} top={0} cursor="pointer">
            <Tinted>
                <Button disabled={opened} o={0.5} circular chromeless={true}>
                    <IconSearch fillOpacity={0} color="var(--color)" />
                </Button>
            </Tinted>
        </XStack>
    </XStack>
})