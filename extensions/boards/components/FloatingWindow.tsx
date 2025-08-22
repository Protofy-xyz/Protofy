import { createElement, useState, useRef } from 'react';
import { XStack, YStack, Text } from '@my/ui';
import { useThemeSetting } from '@tamagui/next-theme'
import { X, Minimize2, Maximize2 } from '@tamagui/lucide-icons'
import { Tinted } from 'protolib/components/Tinted';

export const FloatingWindow = ({ visible, onChangeTab, selectedTab, tabs }) => {
    const openWindowSize = 1010

    const { resolvedTheme } = useThemeSetting()
    const [windowSize, setWindowSize] = useState(1010)
    const darkMode = resolvedTheme == 'dark'

    const isOpenSize = windowSize === openWindowSize;

    return <>
        <div
            onClick={() => { }}
            style={{ pointerEvents: "none", width: "100vw", height: "120vh", position: "fixed", right: visible ? 0 : "-100vw" }}
        ></div>
        {
            <YStack
                pointerEvents='auto'
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
                    <XStack ai="center" gap="$3" p="$2.5" px="$3">
                        <XStack
                            cursor='pointer'
                            onPress={() => {
                                onChangeTab("")
                            }}
                            pressStyle={{ opacity: 0.8 }}
                            hoverStyle={{ scale: 1.05 }}
                        >
                            <X size={18} color="var(--color)" />
                        </XStack>
                        <XStack
                            cursor='pointer'
                            onPress={() => {
                                setWindowSize(prev => {
                                    return prev === 1010 ? window.innerWidth - 330 : 1010
                                })
                            }}
                            pressStyle={{ opacity: 0.8 }}
                            hoverStyle={{ scale: 1.05 }}
                        >
                            {isOpenSize ? <Maximize2 size={18} color="var(--color)" /> : <Minimize2 size={18} color="var(--color)" />}
                        </XStack>
                    </XStack>
                    <YStack
                        borderRightWidth="1px"
                        borderRightColor={"$gray6"}
                    ></YStack>
                    {
                        tabs && Object.keys(tabs).length > 0 && Object.keys(tabs).map((tab, index) => {
                            const isSelected = selectedTab === tab;
                            return <Tinted><XStack
                                key={index}
                                onPress={() => onChangeTab(tab)}
                                cursor="pointer"
                                paddingVertical="$2.5"
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
                                hoverStyle={{ opacity: 0.8 }}
                            >
                                {tabs[tab].icon && createElement(tabs[tab].icon, { size: 16 })}
                                {tabs[tab].label && <Text fontSize="$4">
                                    {tabs[tab].label}
                                </Text>}
                            </XStack></Tinted>
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