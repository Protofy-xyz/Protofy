import { AlertTriangle } from "@tamagui/lucide-icons";
import { YStack, Text, H2 } from "tamagui";
import React from "react"

const ErrorMessage = React.forwardRef(({msg='Error loading content from server', details=''}:any, ref:any) => (
    <YStack flex={1} alignItems="center" justifyContent="center" space="$4" ref={ref}>
        <AlertTriangle size="$7" />
        <H2>{msg}</H2>
        <Text color={"$red10"}>
            {details}
        </Text>
    </YStack>
))

export default ErrorMessage