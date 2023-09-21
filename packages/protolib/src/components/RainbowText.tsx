import React from "react";
import { Text, TextProps } from "tamagui";

export default React.forwardRef((props: TextProps, ref:any) => (
    <Text ref={ref} {...props}>
        <span className="rainbow clip-text">{props.children}</span>
    </Text>
))