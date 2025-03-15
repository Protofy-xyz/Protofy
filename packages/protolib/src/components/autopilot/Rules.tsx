import { useRef, useState } from 'react'
import { TextArea, Button, Spinner, XStack, YStack } from '@my/ui'
import { Trash, Plus } from '@tamagui/lucide-icons'

const minHeight = 49
const maxHeight = 220

const CustomTextArea = ({ ...props }) => (
    <TextArea
        width="100%"
        placeholder="Rule Value..."
        multiline
        size="$4"
        w="100%"
        
        minHeight={minHeight}
        // @ts-ignore
        onMouseDown={(e) => e.stopPropagation()}
        {...props}
        style={{
            border: '0px',
            textAlignVertical: 'top',
            overflowX: 'hidden',
            ...props.style,
        }}
    />
)

export const Rules = ({
    rules, 
    onAddRule,
    onDeleteRule,
    loadingIndex,
}) => {
    const scrollRef = useRef(null)

    const [newRule, setNewRule] = useState('')

    const [heights, setHeights] = useState(
        [...rules.map(() => minHeight), minHeight]
    )

    const handleHeightChange = (index, newHeight) => {
        console.log("newHeight:", newHeight)
        setHeights((prev) => {
            const updatedHeights = [...prev]
            updatedHeights[index] = Math.max(
                minHeight,
                newHeight > maxHeight ? maxHeight : newHeight
            )
            return updatedHeights
        })
    }

    return (
        <YStack height="100%" f={1} w="100%">
            <div
                ref={scrollRef}
                style={{
                    overflowY: 'auto',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {rules.map((rule, i) => (
                    <XStack ai="center" gap="$2" key={i} mb="$2">
                        <CustomTextArea
                            disabled
                            placeholder="Rule Value..."
                            onChange={(e) => {
                                if (typeof document !== 'undefined') {
                                    const { scrollHeight } = e.currentTarget
                                    handleHeightChange(i, scrollHeight)
                                }
                            }}
                            style={{
                                height: heights[i],
                                overflowY: heights[i] < maxHeight ? 'hidden' : 'auto',
                            }}
                            value={rule}
                        />
                        <Button
                            disabled={loadingIndex === i}
                            onMouseDown={(e) => e.stopPropagation()}
                            theme="red"
                            bg="transparent"
                            color="$red9"
                            circular
                            scaleIcon={1.2}
                            icon={loadingIndex === i ? Spinner : Trash}
                            onPress={() => onDeleteRule(i)}
                        />
                    </XStack>
                ))}
            </div>

            <XStack
                ai="center"
                gap="$2"
                mb="$2"
                mt="$4"
                mr={
                    scrollRef?.current?.scrollHeight > scrollRef?.current?.clientHeight
                        ? '6px'
                        : '0px'
                }
            >
                <CustomTextArea
                    // theme="blue"
                    placeholder="Add new rule..."
                    onChangeText={(text) => {
                        setNewRule(text)
                    }}
                    onChange={(e) => {
                        const { scrollHeight } = e.currentTarget
                        handleHeightChange(rules.length, scrollHeight)
                    }}
                    onKeyPress={async (e) => {
                        if(e.key === 'Enter' && !e.shiftKey) {
                            await onAddRule(e, newRule)
                            setNewRule('')
                        }
                    }}
                    value={newRule}
                    style={{
                        height: heights[rules.length],
                        overflowY: heights[rules.length] < maxHeight ? 'hidden' : 'auto',
                    }}
                />
                <Button
                    disabled={loadingIndex === rules.length || newRule.length < 3}
                    onMouseDown={(e) => e.stopPropagation()}
                    bg={newRule.length > 2 ? '$color8' : '$gray6'}
                    // theme="blue"
                    color={newRule.length > 2 ? '$background' : '$gray9'}
                    hoverStyle={{ backgroundColor: '$blue10' }}
                    circular
                    icon={loadingIndex === rules.length ? Spinner : Plus}
                    scaleIcon={1.4}
                    onPress={async (e) => {
                       await onAddRule(e, newRule)
                       setNewRule('')
                    }}
                />
            </XStack>
        </YStack>
    )
}
