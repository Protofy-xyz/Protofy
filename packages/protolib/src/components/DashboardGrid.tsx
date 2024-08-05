import { Responsive, WidthProvider } from "react-grid-layout";
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { XStack, Text, YStack } from 'tamagui'
import { useTint } from '../lib/Tints'

const ResponsiveGridLayout = WidthProvider(Responsive);

export const DashboardGrid = ({ items = [], layouts = {}, borderRadius = 10, padding = 10, backgroundColor }) => {
    const { tint } = useTint()

    return (
        <ResponsiveGridLayout
            className="layout"
            layouts={layouts}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={30}
        >
            {items.map((item) => (
                <YStack
                    key={item.key}
                    backgroundColor={item.backgroundColor ?? backgroundColor}
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

        </ResponsiveGridLayout>
    );
};