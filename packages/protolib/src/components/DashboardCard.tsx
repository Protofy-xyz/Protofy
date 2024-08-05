import { YStack, XStack } from "@my/ui";
import { ReactNode } from "react";
import { Tinted } from './Tinted';

interface DashboardCardProps {
    children: ReactNode;
    id: string
}

export const DashboardCard = ({ children, id }: DashboardCardProps) => {
    return (
        <Tinted>
            <YStack
                key={id}
                borderRadius={10}
                backgroundColor="$bgPanel"
            >
                <XStack
                    w="100%"
                    bc="$color5"
                    btrr={9}
                    btlr={9}
                    jc="center"
                    h={20}
                    ai="center"
                >
                    {children}
                </XStack>
                {children}
            </YStack>
        </Tinted>
    );
}
