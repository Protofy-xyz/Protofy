import { Button, Input, XStack } from "tamagui"
import { Search as IconSearch } from '@tamagui/lucide-icons'
import { useState, forwardRef, useRef, useEffect } from "react"
import { useUpdateEffect } from 'usehooks-ts'

export const Search = forwardRef(({ initialState, onCancel = () => { }, onSearch = () => { }, placeholder = 'Search...', width = 400, widthmd = 300, closedWidth = 50, ...props }: any, ref: any) => {
    const [opened, setOpened] = useState(initialState ? true : false)
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
        {...props}
    >
        {opened ? <Input
            o={1}
            backgroundColor={'$color1'}
            value={content}
            disabled={!opened}
            focusStyle={{ outlineWidth: 0 }}
            height={'$3'}
            //@ts-ignore
            ref={input}
            width={opened ? "100%" : closedWidth}
            placeholder={opened ? placeholder : ''}
            onBlur={() => !content ? setOpened(false) : false}
            onChangeText={(text) => { setContent(text); if (!text) onSearch('') }}
            onSubmitEditing={(e) => { onSearch(content) }}
        /> : null}
        <XStack position={"absolute"} right={0} top={-4} cursor="pointer" opacity={0.7} hoverStyle={{ opacity: 1 }}>
            <Button disabled={opened} bc={"transparent"}>
                <IconSearch fillOpacity={0} color="var(--color)" />
            </Button>
        </XStack>
    </XStack>
})