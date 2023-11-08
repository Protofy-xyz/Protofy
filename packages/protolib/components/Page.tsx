import React from "react";
import { StackProps, YStack, useTheme } from "tamagui";

export const Page = React.forwardRef((props: StackProps, ref: any) => {
    const theme = useTheme()
    return (
        <YStack ref={ref} flex={1} height={"100%"} style={{overflowX:"hidden", backgroundColor: theme.background.val}} {...props}>
            {props.children}
        </YStack>
    );
});

export default Page;