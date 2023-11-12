import {Tinted} from 'protolib'
import React from 'react'
import {XStack, SizableText, ColorProp} from 'tamagui'

export const Chip = ({ icon, text, bold, color, ...props}:{icon?:any, text?: string, bold?: boolean, color?: ColorProp}) => {
    return <XStack ai="center" jc="center" bc={color??'$color5'} p={2} px={"$3"} br={25} {...props}>
            {icon && React.cloneElement(icon, { size:20, strokeWidth: 0.7, color: 'var(--color)' })}
            {text && <SizableText ml={icon?"$2":"$0"} o={0.97} fontWeight={bold?"900":"900"} size="$1" color="$color" >{text}</SizableText>}
        </XStack>
}