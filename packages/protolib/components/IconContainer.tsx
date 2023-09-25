import {Stack, StackProps, XStack} from 'tamagui'

export const IconContainer = (props:StackProps) => (
    <XStack paddingHorizontal={"$3"} opacity={0.5} cursor="pointer" hoverStyle={{ opacity: 0.8 }} {...props}>
        {props.children}
    </XStack>
)