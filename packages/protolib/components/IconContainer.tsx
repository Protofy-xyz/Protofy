import {Stack, StackProps, XStack} from '@my/ui'

export const IconContainer = (props:StackProps & {selected?: boolean}) => (
    <XStack paddingHorizontal={"$3"} opacity={props.disabled?0.2:(props.selected?0.8:0.5)} cursor={props.disabled ? "default":"pointer"} hoverStyle={{ opacity: props.disabled ? 0.2 : 0.8 }} {...props} {...(!props.disabled?{}:{onPress: () =>{}})}>
        {props.children}
    </XStack>
)