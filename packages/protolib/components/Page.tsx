import React from "react";
import { StackProps, YStack, useTheme } from "tamagui";
import { useIsEditing } from "protolib"

export const Page = React.forwardRef((props: StackProps, ref: any) => {
    const theme = useTheme()
    const isEditing = useIsEditing()
    return (
        <YStack id={"protolib-page-container"} ref={ref} flex={1} height={"100%"} style={{overflowX:"hidden", ...(isEditing?{backgroundColor: theme.background.val}:{})}} {...props}>
            {props.children}
        </YStack>
    );
});

export default Page;