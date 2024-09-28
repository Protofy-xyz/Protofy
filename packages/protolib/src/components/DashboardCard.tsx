import { ReactNode } from "react";
import { Tinted } from './Tinted';
import { StackProps, XStack, YStack, Text } from 'tamagui';

interface DashboardCardProps {
    children: ReactNode;
    id: string;
    title?: string;
    titleProps?: StackProps;
    containerProps?: StackProps;
}

export const DashboardCard = ({ children, id, title, titleProps = {}, containerProps = {} }: DashboardCardProps) => {
    return (
        <Tinted>
            <YStack
                key={id}
                borderRadius={10}
                backgroundColor="$bgPanel"
                flex={1}
                {...containerProps}
                style={{ height: '100%', overflow: 'hidden', ...containerProps.style }}
            >
                {title ? (
                    <XStack
                        w="100%"
                        btrr={9}
                        btlr={9}
                        ml={15}
                        mt={10}
                        h={20}
                        ai="center"
                        {...titleProps}
                    >
                        <Text>{title}</Text>
                    </XStack>
                ) : null}
                <YStack
                    flex={1}
                    paddingHorizontal={15}
                    paddingBottom={15}
                    style={{ overflowY: 'auto', maxHeight: '100%' }}
                >
                    {children}
                </YStack>
            </YStack>
        </Tinted>
    );
}
