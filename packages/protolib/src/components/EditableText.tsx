import React, { useRef, useState } from "react"
import { XStack } from "tamagui"
import { Stack } from "tamagui"
import { Paragraph, TamaguiTextElement, TextArea } from "tamagui"

const EditableText = React.forwardRef(({ text='', placeHolder='' }: any, ref:any) => {
    const [ready, setReady] = useState(false)
    const [content, setContent] = useState(text)
    const textAreaRef = useRef(null)
    const paragraphRef = useRef<TamaguiTextElement>(null)
    const textArea = textAreaRef.current
    const paragraph = paragraphRef.current

    const reLayout = () => {
        if(!textArea || !paragraph) return
        //@ts-ignore
        console.log('scroll height: ', textArea.scrollHeight, 'height: ', textArea.style.height)
        //@ts-ignore
        textArea.style.height = 'auto';
        //@ts-ignore
        textArea.style.height = textArea.scrollHeight + 'px'
    }

    return (<XStack flex={1} width={'100%'} ref={ref}>
        {/*@ts-ignore*/}
        <Paragraph color={"$color"} ref={paragraphRef} opacity={ready?0:1} position={ready?'absolute':'relative'} cursor="default" size="$4" fow="500">
            {content}
        </Paragraph>
        
        <TextArea
            spellCheck={false}
            placeholderTextColor={"$color"}
            placeholder={placeHolder}
            ref={textAreaRef}
            overflow={"hidden"}
            opacity={!ready?0:1}
            position={!ready?'absolute':'relative'}
            onLayout={(e) => {
                if(!textArea || !paragraph) return
                reLayout()
                //@ts-ignore
                paragraph.style.position = 'absolute'
                //@ts-ignore
                paragraph.style.opacity = 0
                //@ts-ignore
                textArea.style.position = 'relative'
                //@ts-ignore
                textArea.style.opacity = 1
                setReady(true)
            }}
            onChangeText={(text) => {reLayout(); setContent(text)}}
            onContentSizeChange={reLayout}
            width="100%"
            size="$4"
            //@ts-ignore
            p={0}
            space={0}
            borderWidth={0}
            readOnly={false}
            value={content}>
        </TextArea>
    </XStack>)
})

export default EditableText