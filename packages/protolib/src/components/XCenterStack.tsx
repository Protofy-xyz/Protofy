import { StackProps, XStack } from "tamagui"

const XCenterStack = (props: StackProps) => (
    //@ts-ignore
    <XStack ai="center" jc="center" $xxs={{ ai: 'center', fw: 'wrap' }} {...props}>
        {props.children}
    </XStack>
)
export default XCenterStack