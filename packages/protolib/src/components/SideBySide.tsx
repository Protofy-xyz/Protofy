import { XStack, YStack } from 'tamagui'
import React from 'react';

const SideBySide = React.forwardRef(({ children }: any, ref: any) => {
    const childArray = React.Children.toArray(children);
    if (childArray.length < 3) {
        return <h1>Error: SideBySide expectes 3 children</h1>
    }
    return (<XStack
        ref={ref}
        position="relative"
        justifyContent="space-between"
        $sm={{ flexDirection: 'column' }}
    >
        <YStack
            flex={1}
            maxWidth="50%"
            $sm={{ maxWidth: '100%' }}
            paddingHorizontal="$2"
            space
        >
            {childArray[0]}
        </YStack>

        <YStack
            $sm={{ display: 'none' }}
            position="absolute"
            left={0}
            right={0}
            alignItems="center"
            justifyContent="center"
            top="55%"
            theme="alt2"
            zIndex={1000}
            //@ts-ignore
            pe="none"
        >
            {childArray[1]}
        </YStack>

        <YStack
            flex={1}
            maxWidth="50%"
            $sm={{ maxWidth: '100%', marginTop: '$6' }}
            paddingHorizontal="$2"
            space
        >
            {childArray[2]}
        </YStack>
    </XStack>)
})

export default SideBySide