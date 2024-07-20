import React, { useContext } from "react";
import { Button, ButtonProps, Stack, XGroup } from "tamagui";
import { ActiveGroupContext } from "./ActiveGroup";

export const GroupButton = React.forwardRef(( {inActive, ...props} : ButtonProps & {inActive?: boolean}, ref: any) => {
    return (<Stack ref={ref}>
        <XGroup.Item>
            <Button {...{
                border: 0,
                focusStyle: {outlineWidth:0},
                borderRadius: 0,
                size: "$3",
                opacity: inActive?0.5:1,
                // fontFamily: "$silkscreen",
                ...props
            }} />
        </XGroup.Item>
    </Stack>
    )
})

export default GroupButton