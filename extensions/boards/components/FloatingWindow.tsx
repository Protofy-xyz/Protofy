import { createElement } from 'react';
import { XStack, YStack, Text } from '@my/ui';
import { useThemeSetting } from '@tamagui/next-theme'

export const FloatingWindow = ({ visible, onChangeTab, selectedTab, tabs, windowSize = 1010 }) => {
    const { resolvedTheme } = useThemeSetting()
    const darkMode = resolvedTheme == 'dark'

    return <>
        <div
            onClick={() => { onChangeTab("") }}
            style={{ width: "100vw", height: "120vh", position: "fixed", right: visible ? 0 : "-100vw" }}
        ></div>
        {
            <YStack
                position="fixed"
                animation="quick"
                right={visible ? 40 : -windowSize}
                top={"70px"}
                width={windowSize}
                height="calc(100vh - 100px)"
                bc={darkMode ? 'var(--bgPanel)' : 'white'}
                borderWidth={2} 
                br="$5" 
                elevation={60} 
                shadowOpacity={0.2} 
                shadowColor={"black"} 
                bw={1} 
                boc="$gray6"
                overflow='hidden'
                gap="2px"
            >
                <XStack borderBottomColor={"$gray6"} borderBottomWidth="1px">
                    {
                        tabs && Object.keys(tabs).length > 0 && Object.keys(tabs).map((tab, index) => {
                            const isSelected = selectedTab === tab;
                            return <XStack
                                key={index}
                                onPress={() =>  onChangeTab(tab)}
                                cursor="pointer"
                                paddingVertical="$2"
                                paddingHorizontal="$4"
                                style={{
                                    boxShadow: isSelected
                                        ? '0px 2px 0px var(--color8)'
                                        : 'none',
                                    transition: 'box-shadow 0.2s ease'
                                }}
                                justifyContent="center"
                                gap="$2"
                                alignItems="center"
                                opacity={isSelected ? 1 : 0.6}
                            >
                                {tabs[tab].icon && createElement(tabs[tab].icon, {size: 16})}
                                {tabs[tab].label && <Text fontSize="$4">
                                    {tabs[tab].label}
                                </Text>}
                            </XStack>
                        })
                    }
                </XStack>
                <XStack flex={1}>
                    {
                        tabs && tabs[selectedTab] && tabs[selectedTab].content && tabs[selectedTab].content
                    }
                </XStack>
            </YStack>
        }
    </>
}