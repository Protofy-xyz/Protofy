import { Input, XStack } from "tamagui"
import {Search as IconSearch} from '@tamagui/lucide-icons'
import { useState, forwardRef, useRef, useEffect } from "react"
import { useUpdateEffect} from 'usehooks-ts'

export const Search = forwardRef(({initialState, onCancel=() => {},onSearch=() => {}, placeholder='Search...', width=400, widthmd=300, closedWidth=50}:any, ref:any) => {
    const [opened, setOpened] = useState(initialState?true:false)
    const input = useRef()
    const [content, setContent] = useState(initialState)

    useUpdateEffect(() => {
        if(opened) {
            //@ts-ignore
            input.current?.focus()
        } else {
            onCancel()
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
            height={'$3'}
            //@ts-ignore
            ref={input}
            width={opened?"100%":closedWidth} 
            placeholder={opened?placeholder:''} 
            onBlur={() => !content?setOpened(false):false}
            onChangeText={(text) => {setContent(text);if(!text) onSearch('')}}
            onSubmitEditing={(e)=> {onSearch(content)}}
        />:null}
        <XStack position={"absolute"} right={15} top={6} cursor="pointer" opacity={0.7} hoverStyle={{ opacity: 1 }}>
            <IconSearch color="var(--color)" />
        </XStack>
    </XStack>
})