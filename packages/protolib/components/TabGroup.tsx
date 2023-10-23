import { useTint } from '../lib/Tints'
import React, { memo, useState } from 'react'
import { Button, ScrollView, XGroup, XStack, YStack, YStackProps } from 'tamagui'

type TabGroupProps = {
    title: any,
    tabs: string[],
    children: any,
    containerProps?: YStackProps
}
const TabGroup = memo(React.forwardRef(({ title, tabs, children, containerProps = {} }: TabGroupProps, ref:any) => {
    const [activeIndex, setActiveIndex] = useState(0)
    const { tint } = useTint()
    const childArray = React.Children.toArray(children);
    return (
        <YStack ref={ref} overflow="hidden" flex={1}>
            <>
                <ScrollView
                    alignSelf="center"
                    alignItems="center"
                    zIndex={10}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    marginBottom="$-2"
                    maxWidth="100%"
                >
                    <XStack paddingHorizontal="$4" flexShrink={0} space>
                        <XGroup size="$2" bordered>
                            <XGroup.Item>
                                <Button disabled size="$2" fontSize="$4" paddingHorizontal="$4">
                                    {title}
                                </Button>
                            </XGroup.Item>
                        </XGroup>
                        <XGroup size="$2" bordered>
                            {tabs? tabs.map((tab, i) => (
                                <XGroup.Item key={i}>
                                    <Button
                                        accessibilityLabel={tab}
                                        onPress={() => setActiveIndex(i)}
                                        theme={i === activeIndex ? (tint as any) : 'alt1'}
                                        size="$2"
                                        borderRadius="$0"
                                    >
                                        {tab}
                                    </Button>
                                </XGroup.Item>
                            )):null}
                        </XGroup>
                    </XStack>
                </ScrollView>
            </>
            <XStack maxWidth="100%" flex={1}>
                <YStack flex={1} maxWidth="100%" opacity={0.9} hoverStyle={{ opacity: 1 }}>
                    <YStack
                        borderRadius="$4"
                        backgroundColor="$backgroundHover"
                        borderColor="$borderColor"
                        overflow="hidden"
                        borderWidth={1}
                        flex={1}
                        height={325}
                        maxHeight={325}
                        {...containerProps}
                    >
                        <ScrollView
                            contentContainerStyle={{
                                flex: 1,
                            }}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                        >
                            <ScrollView
                                horizontal
                                contentContainerStyle={{
                                    flex: 1,
                                }}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                            >
                                {
                                    childArray[activeIndex]
                                }
                            </ScrollView>
                        </ScrollView>
                    </YStack>
                </YStack>
            </XStack>
        </YStack>
    )
}))

export default TabGroup