import { ButtonProps, Button, Text } from "tamagui"
import React from 'react'

const ButtonSimple = React.forwardRef(({textColor = undefined, fontFamily = "$silkscreen", ...props}: ButtonProps & any, ref: any) => (
    <Button
        //@ts-ignore
        ref={ref}
        borderRadius="$10"
        size="$3"
        elevate
        space="$3"
        {...props}
    >
        <Text color={textColor} fontFamily={fontFamily} display="flex" alignItems="center">
            {props.children}
        </Text>
    </Button>
))

export default ButtonSimple