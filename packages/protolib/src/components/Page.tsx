import React from "react";
import { StackProps, YStack } from "tamagui";

export const Page = React.forwardRef((props: StackProps, ref: any) => {
    return (
        <YStack ref={ref} flex={1} height={"100%"} backgroundColor={"$background"} style={{overflowX:"hidden"}} {...props}>
            {props.children}
        </YStack>
    );
});

export default Page;