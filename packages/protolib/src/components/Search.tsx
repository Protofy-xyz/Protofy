import { Input, XStack } from "tamagui"
import {Search as IconSearch} from '@tamagui/lucide-icons'
import { useState, forwardRef, useRef, useEffect } from "react"

export const Search = forwardRef(({placeholder='Search...', width=400, widthmd=300, closedWidth=50}:any, ref) => {
    const [opened, setOpened] = useState(false)
    const input = useRef()
    const [content, setContent] = useState('')

    useEffect(() => {
        if(opened) {
            //@ts-ignore
            input.current?.focus()
        }
    }, [opened])
    //@ts-ignore
    return <XStack 
        width={opened?width:closedWidth}
        $md={{width: opened?widthmd: closedWidth}}
        $sm={{ width: opened?'100%':closedWidth }} 
        onPress={() => setOpened(true)} 
        ref={ref}
    >
        {opened?<Input 
            value={content}
            disabled={!opened}
            outlineStyle="none"
            focusStyle={{borderWidth:0}}
            //@ts-ignore
            ref={input}
            width={opened?"100%":closedWidth} 
            placeholder={opened?placeholder:''} 
            onBlur={() => !content?setOpened(false):false}
            onChangeText={(text) => setContent(text)}
        />:null}
        <XStack position={"absolute"} right={15} top={8} cursor="pointer" opacity={0.5} hoverStyle={{ opacity: 1 }}>
            <IconSearch color="var(--color)" />
        </XStack>
    </XStack>
})