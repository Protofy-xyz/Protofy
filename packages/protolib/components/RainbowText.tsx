import React from "react";
import { Text, TextProps } from "tamagui";

export default React.forwardRef(({rainbowType, ...props}: TextProps & {rainbowType?: string}, ref:any) => (
    <Text ref={ref} {...props}>
        <div className={(rainbowType??"rainbow")+" clip-text"} style={{display: 'inline-block'}}>{props.children}</div>
    </Text>
))