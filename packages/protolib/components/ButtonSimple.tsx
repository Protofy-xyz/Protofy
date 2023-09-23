import { ButtonProps, Button } from "tamagui"
import React from 'react'

const ButtonSimple = React.forwardRef((props:ButtonProps, ref:any) => (
    <Button
        //@ts-ignore
        ref={ref}
        borderRadius="$10"
        size="$3"
        elevate
        fontFamily="$silkscreen"
        space="$3"
        {...props}
    >
        {props.children}
    </Button>
))

export default ButtonSimple