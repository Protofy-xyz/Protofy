import React from 'react'
import { GroupProps, XGroup } from "tamagui"

const ButtonGroup = React.forwardRef((props: GroupProps, ref:any) => {
    return (
        <XGroup
            ref={ref}
            scrollable
            bordered
            //@ts-ignore
            bc="$color2"
            maxWidth="100%"
            als="center"
            ov="hidden"
            {...props}
        >
            {props.children}
        </XGroup>
    )
})

export default ButtonGroup