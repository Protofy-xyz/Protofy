import { Stack, StackProps } from 'tamagui'
import React from "react"

export const Pressable = React.forwardRef((props: StackProps, ref: any) => {
    return <Stack
        ref={ref}
        backgroundColor={"$color4"}
        padding="$2"
        borderRadius="$4"
        shadowRadius={"$3"}
        shadowColor={"$shadowColor"}
        shadowOffset={{ width: 0, height: 8 }}
        cursor='pointer'
        {...props}
        hoverStyle={{
            backgroundColor: "$color5",
            ...props.hoverStyle
        }}
    >
    </Stack>;
})