import React from "react";
import { SizableText, Text, TextProps } from "tamagui";

export default React.forwardRef(({rainbowType, ...props}: TextProps & {rainbowType?: string}, ref:any) => (
    <Text fontSize="$14" lineHeight={"$14"} ref={ref} {...props}>
        <div className={(rainbowType??"rainbowSoft")+" clip-text"} style={{display: 'inline-block'}}>{props.children}</div>
    </Text>
))