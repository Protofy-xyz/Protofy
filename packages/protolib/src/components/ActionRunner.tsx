import { Button, Input, Paragraph, XStack, YStack, Tooltip } from '@my/ui';
import React from 'react';

export const ActionRunner = ({ name, caption="Run", description="", actionParams={}, onRun, icon }) => {
    const [params, setParams] = React.useState({})
    return <XStack f={1} width="100%">
        <YStack f={1} alignItems="center" justifyContent="center">
            {Object.keys(actionParams).map((key) => {
                return <Tooltip>
                    <Tooltip.Trigger width={"100%"}>
                        <XStack width="100%" alignItems="center">
                            <Paragraph flex={1} mr={"$5"}>{key}</Paragraph>
                            <Input onChangeText={(text) => setParams({
                                ...params,
                                [key]: text
                            })} flex={2} placeholder="Value" className="no-drag" />
                        </XStack>
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                        <Tooltip.Arrow />
                        <Paragraph>{actionParams[key]}</Paragraph>
                    </Tooltip.Content>
                </Tooltip>
            })}
            <Tooltip>
                <Tooltip.Trigger width={"100%"}>
                    <Button mt={"$3"} width="100%" className="no-drag" onPress={() => {
                        //actionData.automationParams is a key value object where the key is the name of the parameter and the value is the description
                        //if there are parameters, they should be included in the query parameters of the request
                        //if a parameter is missing, remove it from the query parameters
                        const cleanedParams = {}
                        for (const key in params) {
                            if (params[key] || params[key] === "0") {
                                cleanedParams[key] = params[key]
                            }
                        }
                        onRun(name, cleanedParams)
                    }}
                        icon={icon}
                    >
                        {caption}
                    </Button>
                </Tooltip.Trigger>
                <Tooltip.Content>
                    <Tooltip.Arrow />
                    <Paragraph>{description}</Paragraph>
                </Tooltip.Content>
            </Tooltip>
        </YStack>
    </XStack>
}