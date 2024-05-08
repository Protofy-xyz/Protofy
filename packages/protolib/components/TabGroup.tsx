import { useTint } from '../lib/Tints'
import React, { memo, useState } from 'react'
import { Button, ScrollView, SizableText, XGroup, XStack, YStack, YStackProps } from 'tamagui'
import { useThemeSetting } from '@tamagui/next-theme'

type TabGroupProps = {
    tabs: string[],
    children: any,
    containerProps?: YStackProps
}
const TabGroup = memo(React.forwardRef(({ tabs, children, containerProps = {} }: TabGroupProps, ref: any) => {
    const [activeIndex, setActiveIndex] = useState(0)
    const { tint } = useTint()
    const childArray = React.Children.toArray(children);
    const { resolvedTheme } = useThemeSetting()

    return (
        <YStack ref={ref} overflow="hidden" flex={1}>
            <XStack f={1} borderBottomColor={"$gray5"} borderBottomWidth={2} paddingHorizontal="$4" flexShrink={0} space>
                <XGroup size="$2" f={1} br={0} position="relative" top={2}>
                    {tabs ? tabs.map((tab, i) => (
                        <XGroup.Item key={i}>
                            <XStack
                                paddingTop="$3"
                                paddingBottom="$3"
                                borderWidth={0}
                                borderBottomWidth={4}
                                borderBottomColor={i === activeIndex ? '$color7' : 'transparent'}
                                hoverStyle={{ backgroundColor: resolvedTheme == 'dark' ? '$gray1': '$gray4' }}
                                borderTopRightRadius="$3"
                                borderTopLeftRadius="$3"
                                br={"$3"}
                                theme={tint as any}
                                cursor='pointer'
                                onPress={() => setActiveIndex(i)}
                                f={1}
                            >
                                <SizableText
                                    userSelect='none'
                                    textAlign='center'
                                    accessibilityLabel={tab}
                                    o={i === activeIndex ? 1 : 0.7}
                                    color={i === activeIndex ? '$color8' : '$color'}
                                    theme={i === activeIndex ? (tint as any) : 'alt1'}
                                    size="$2"
                                    f={1}
                                    fontWeight={i === activeIndex ? '600' : '600'}
                                >
                                    {tab}
                                </SizableText>
                            </XStack>

                        </XGroup.Item>
                    )) : null}
                </XGroup>
            </XStack>
            <XStack maxWidth="100%" flex={1}>
                <YStack flex={1} maxWidth="100%" opacity={0.9} hoverStyle={{ opacity: 1 }}>
                    <YStack
                        backgroundColor="$backgroundHover"
                        borderColor="$borderColor"
                        overflow="hidden"
                        borderWidth={1}
                        flex={1}
                        {...containerProps}
                    >
                        {childArray[activeIndex]}
                    </YStack>
                </YStack>
            </XStack>
        </YStack>
    )
}))

export default TabGroup