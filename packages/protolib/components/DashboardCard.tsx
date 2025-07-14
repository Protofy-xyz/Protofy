import { ReactNode, useState, useEffect } from "react";
import { Tinted } from './Tinted';
import { StackProps, XStack, YStack, Paragraph } from '@my/ui';

interface DashboardCardProps {
    children: ReactNode;
    id: string;
    title?: string;
    status?: "running" | "error" | "idle" | "success";
    hideTitle?: boolean;
    titleProps?: StackProps;
    containerProps?: StackProps;
    cardActions?: ReactNode;
}

export const DashboardCard = ({
    children,
    status,
    hideTitle,
    id,
    title,
    cardActions = <></>,
    titleProps = {},
    containerProps = {}
}: DashboardCardProps) => {
    const [hovered, setHovered] = useState(false);
    const [showRunning, setShowRunning] = useState(false);

    useEffect(() => {
        if (status === 'running') {
            setShowRunning(true);
        } else if (showRunning) {
            // Si ya estaba en running, esperamos 2s antes de ocultarlo
            const timeout = setTimeout(() => {
                setShowRunning(false);
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [status]);

    return (
        <>
            <style>{`
                @keyframes dashOffset {
                    0% { stroke-dashoffset: 100; }
                    100% { stroke-dashoffset: 0; }
                }
            `}</style>

            <Tinted>
                <YStack
                    animation="quick"
                    cursor="default"
                    onHoverIn={() => setHovered(true)}
                    onHoverOut={() => setHovered(false)}
                    key={id}
                    borderRadius={10}
                    backgroundColor="$bgPanel"
                    flex={1}
                    position="relative"
                    {...containerProps}
                    style={{
                        height: '100%',
                        overflow: 'hidden',
                        ...containerProps.style,
                    }}
                >
                    {showRunning && (
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                zIndex: 0,
                                pointerEvents: 'none',
                            }}
                        >
                            <svg width="100%" height="100%">
                                <rect
                                    x="1"
                                    y="1"
                                    width="calc(100% - 2px)"
                                    height="calc(100% - 2px)"
                                    fill="none"
                                    stroke="var(--color7)"
                                    strokeWidth="2"
                                    strokeDasharray="8 4"
                                    strokeDashoffset="0"
                                    rx="10"
                                    ry="10"
                                    style={{
                                        animation: 'dashOffset 2s linear infinite',
                                    }}
                                />
                            </svg>
                        </div>
                    )}

                    {!showRunning && status !== 'running' && (
                        <YStack
                            position="absolute"
                            top={0}
                            left={0}
                            right={0}
                            bottom={0}
                            borderRadius={10}
                            borderWidth={2}
                            borderStyle="dashed"
                            borderColor={
                                status === 'error' ? "$red7" : '$colorTransparent'
                            }
                            pointerEvents="none"
                            style={{ zIndex: 0 }}
                        />
                    )}

                    {(title || cardActions) && (
                        <XStack
                            w="100%"
                            btrr={9}
                            btlr={9}
                            mt={hideTitle ? 0 : 10}
                            h={20}
                            ai="center"
                            zIndex={1}
                            {...titleProps}
                        >
                            {title && !hideTitle ? (
                                <Paragraph
                                    flex={1}
                                    fow="500"
                                    textOverflow={"ellipsis"}
                                    textAlign="center"
                                    overflow="hidden"
                                    whiteSpace={"nowrap"}
                                    fos={"$4"}
                                >
                                    {title}
                                </Paragraph>
                            ) : null}
                            <XStack
                                position="absolute"
                                mt={hideTitle ? 15 : 0}
                                right={0}
                                className="no-drag"
                                mr="$3.5"
                                opacity={hovered ? 0.75 : 0}
                                pressStyle={{ opacity: 0.9 }}
                            >
                                {cardActions}
                            </XStack>
                        </XStack>
                    )}

                    <YStack
                        flex={1}
                        style={{ overflowY: 'auto', maxHeight: '100%', zIndex: 1 }}
                    >
                        {children}
                    </YStack>
                </YStack>
            </Tinted>
        </>
    );
};
