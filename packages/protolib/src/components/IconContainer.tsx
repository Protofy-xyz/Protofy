import {Stack, StackProps, XStack} from 'tamagui'

export const IconContainer = (props:StackProps) => (
    <XStack paddingHorizontal={"$3"} opacity={props.disabled?0.2:0.5} cursor={props.disabled ? "default":"pointer"} hoverStyle={{ opacity: props.disabled ? 0.2 : 0.8 }} {...props} {...(!props.disabled?{}:{onPress: () =>{}})}>
        {props.children}
    </XStack>
)