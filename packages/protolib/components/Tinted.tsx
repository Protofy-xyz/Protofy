import { useTint } from "@tamagui/logo";
import React from "react"
import { Theme } from "tamagui";
export const Tinted = React.forwardRef((props: any, ref: any) => {
    const {tint} = useTint()
    return <Theme name={tint as any}>
      {props.children}
    </Theme>;
})