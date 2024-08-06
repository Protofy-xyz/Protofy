import { ReactNode, HTMLAttributes } from "react";
import { Tinted } from './Tinted';
import { StackProps, XStack, YStack, isClient, } from 'tamagui'

interface DashboardCardProps {
    children: ReactNode;
    id: string,
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
                style={{ overflow: 'hidden' }} 
            >
                {title?<XStack
                    w="100%"
                    btrr={9}
                    btlr={9}
                    ml={15}
                    mt={10}
                    h={20}
                    ai="center"
                    {...titleProps}
                >
                    {title}
                </XStack>:<></>}
                <XStack
                flex={1}
                padding={15}>
                    {children}
                </XStack>
                
            </YStack>
        </Tinted>
    );
}
