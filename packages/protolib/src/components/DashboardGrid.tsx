import React from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';


import { Theme, XStack, Paragraph, Stack, Spinner, Text, Dialog, Button, Popover, YStack } from 'tamagui'

import { useTint } from '../lib/Tints'
import { Tinted } from './Tinted';

export const DashboardGrid = ({ items = [], borderRadius = 10, padding = 10, backgroundColor }) => {
    const layout = items.map(item => ({
        i: item.key,
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
    }));
    const { tint } = useTint()

    return (
        <GridLayout className="layout" layout={layout} cols={12} rowHeight={30} width={1200}>
            {items.map((item) => (

                    <YStack
                        key={item.key}
                        backgroundColor={item.backgroundColor?? backgroundColor}
                        borderRadius={item.borderRadius ?? borderRadius}
                    >
                        <XStack
                            w="100%"
                            bc="$backgroundHover"
                            btrr={9}
                            btlr={9}
                            jc="center"
                            h={30}
                            ai="center"
                        >{item.content}
                        </XStack>
                        <Text>{item.content}</Text>
                    </YStack>

            ))}
        </GridLayout>
    );
};