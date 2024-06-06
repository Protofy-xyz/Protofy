import React from "react";
import { SizableText, Text, TextProps } from "tamagui";

export default React.forwardRef(({rainbowType, ...props}: TextProps & {rainbowType?: string}, ref:any) => (
    <SizableText ref={ref} {...props}>
        <div className={(rainbowType??"rainbow")+" clip-text"} style={{display: 'inline-block'}}>{props.children}</div>
    </SizableText>
))