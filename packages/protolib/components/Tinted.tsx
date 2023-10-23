
import React from "react"
import { Theme } from "tamagui";
import { useTint } from "../lib/Tints";

export const Tinted = React.forwardRef((props: any, ref: any) => {
    const {tint} = useTint()
    return <Theme name={props.tint?props.tint : tint as any}>
      {props.children}
    </Theme>;
})