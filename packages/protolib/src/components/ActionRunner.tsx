import { Button, Input, Paragraph, XStack, YStack, Tooltip, Spinner } from '@my/ui';
import React from 'react';
import { useMemo } from 'react'

export const ActionRunner = ({ name, caption = "Run", description = "", actionParams = {}, onRun, icon, color = 'var(--color7)' }) => {
    const [params, setParams] = React.useState({})
    const [loading, setLoading] = React.useState(false)
    const labelWidth = useMemo(() => {
        const margin = 10
        const keys = Object.keys(actionParams)
        if (keys.length === 0) return 50
        const longestKey = keys.reduce((acc, cur) => (cur.length > acc.length ? cur : acc), '')
        return longestKey.length * 8 + margin
    }, [actionParams])

    return <XStack f={1} width="100%">
        <YStack f={1} alignItems="center" justifyContent="center">
            {/*Icon*/}
            {typeof icon === 'string' && <div style={{
                width: "48px",
                height: "48px",
                marginBottom: '15px',
                backgroundColor: color,
                maskImage: `url(${icon})`,
                WebkitMaskImage: `url(${icon})`,
                maskRepeat: "no-repeat",
                WebkitMaskRepeat: "no-repeat",
                maskSize: "contain",
                WebkitMaskSize: "contain",
                maskPosition: "center",
                WebkitMaskPosition: "center"
            }} />}
            {Object.keys(actionParams).map((key) => {
                return (
                    <Tooltip key={key}>
                        <Tooltip.Trigger width="100%">
                            <XStack width="100%" alignItems="center" mb="$3">
                                <Paragraph width={labelWidth} mr="$3">
                                    {key}
                                </Paragraph>
                                <Input
                                    flex={1}
                                    placeholder="Value"
                                    className="no-drag"
                                    value={params[key] ?? ''}
                                    onChangeText={(text) =>
                                        setParams({
                                            ...params,
                                            [key]: text,
                                        })
                                    } 
                                />
                            </XStack>
                        </Tooltip.Trigger>

                        <Tooltip.Content>
                            <Tooltip.Arrow />
                            <Paragraph>{actionParams[key]}</Paragraph>
                        </Tooltip.Content>
                    </Tooltip>
                )
            })}
            <Tooltip>
                <Tooltip.Trigger width={"100%"}>
                    <YStack alignItems="center" justifyContent="center">
                        <Button pressStyle={{ filter: "brightness(0.95)", backgroundColor: color }} hoverStyle={{ backgroundColor: color, filter: "brightness(1.1)" }} backgroundColor={color} mt={"$3"} width="100%" className="no-drag" onPress={async () => {
                            //actionData.automationParams is a key value object where the key is the name of the parameter and the value is the description
                            //if there are parameters, they should be included in the query parameters of the request
                            //if a parameter is missing, remove it from the query parameters
                            const cleanedParams = {}
                            for (const key in params) {
                                if (params[key] || params[key] === "0") {
                                    cleanedParams[key] = params[key]
                                }
                            }
                            setLoading(true)
                            try {
                                await onRun(name, cleanedParams)
                            } catch (e) { } finally {
                                setLoading(false)
                            }
                        }}>
                            {loading ? <Spinner /> : caption}
                        </Button>
                    </YStack>
                </Tooltip.Trigger>
                <Tooltip.Content>
                    <Tooltip.Arrow />
                    <Paragraph>{description}</Paragraph>
                </Tooltip.Content>
            </Tooltip>
        </YStack>
    </XStack>
}