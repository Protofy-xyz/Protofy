import { Text, TextProps } from 'tamagui'
import React, { useState } from "react"
import { useEventEffect, useLastEvent } from '../bundles/events/hooks';

type Props = {
    object: string,
    elementId: string,
    field: string,
    noValueText?: string
}

export const ObjectPropValue = React.forwardRef(({ object, elementId, field, noValueText, ...props }: Props & TextProps, ref: any) => {

    const defaultValue = noValueText ?? "n/a"

    const value: any = useLastEvent({ path: object + "/update/" + elementId })

    return <Text ref={ref} {...props}>
        {(value && value?.payload?.data[field]) ?? defaultValue}
    </Text>;
})