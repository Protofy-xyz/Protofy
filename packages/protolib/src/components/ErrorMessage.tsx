import { AlertTriangle } from "@tamagui/lucide-icons";
import { YStack, Text, H2, StackProps } from "tamagui";
import React from "react"

type ErrorMessageProps = {
    msg?: string,
    details?: any,
    icon?: any,
    detailsColor?: string,
    containerProps?: StackProps,
    iconProps?: any,
    children?:any
}
const ErrorMessage = React.forwardRef(({
    msg = 'Error loading content from server',
    details = '',
    icon = AlertTriangle,
    detailsColor = '$red10',
    containerProps = {},
    iconProps = {},
    children,
    ...props
}: ErrorMessageProps & StackProps, ref: any) => {
    const Icon = icon
    return <YStack flex={1} alignItems="center" justifyContent="center" space="$4" ref={ref} {...props}>
        <YStack alignItems="center" space="$4" {...containerProps}>
            <Icon size="$7" {...iconProps} />
            <H2 fontWeight={"500"}>{msg}</H2>
            <Text color={detailsColor}>
                {details}
            </Text>
        </YStack>
        {children}
    </YStack>
})

export default ErrorMessage