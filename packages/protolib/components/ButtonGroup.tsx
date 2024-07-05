import React from 'react'
import { GroupProps, XGroup, YGroup } from "tamagui"

export const ButtonGroup = React.forwardRef(({ mode, ...props }: GroupProps & { mode?: "vertical" | "horizontal" }, ref: any) => {
    return !mode || mode == 'horizontal' ? (
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
    ) : <YGroup
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
    </YGroup>
})

export default ButtonGroup