import React from 'react'
import {XStack, SizableText, ColorProp, Spinner, Spacer, XStackProps} from 'tamagui'

export const Chip = ({ loading, icon, text, bold, color, children, ...props}:{loading?:boolean, icon?:any, text?: string, bold?: boolean, color?: ColorProp} & XStackProps) => {
    return <XStack ai="center" jc="center" bc={color??'$color5'} p={2} px={"$3"} br={25} {...props}>
            {icon && React.cloneElement(icon, { size:20, strokeWidth: 0.7, color: 'var(--color)' })}
            {children}
            {text && <SizableText ml={icon?"$2":"$0"} o={0.97} fontWeight={bold?"900":"400"} size="$1" color="$color" >{text}</SizableText>}
            {loading && <><Spacer size={9} /><Spinner color={"var(--color8)"} scale={0.7} size='small' /></>}
        </XStack>
}