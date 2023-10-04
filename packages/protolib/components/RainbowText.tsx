import React from "react";
import { Text, TextProps } from "tamagui";

export default React.forwardRef((props: TextProps, ref:any) => (
    <Text ref={ref} {...props}>
        <div className="rainbow clip-text" style={{display: 'inline-block'}}>{props.children}</div>
    </Text>
))