import {Stack, StackProps} from 'tamagui'

export const IconContainer = (props:StackProps) => (
    <Stack paddingHorizontal={"$3"} opacity={0.5} cursor="pointer" hoverStyle={{ opacity: 0.8 }} {...props}>
        {props.children}
    </Stack>
)