import React from 'react'
import {XStack, SizableText, ColorProp, Spinner, Spacer, XStackProps} from 'tamagui'

export const Chip = ({ loading, icon, text, bold, color, children, ...props}:{loading?:boolean, icon?:any, text?: string, bold?: boolean, color?: ColorProp} & XStackProps) => {
    return <XStack alignItems="center" justifyContent="center" backgroundColor={color??'$color5'} padding={2} paddingHorizontal={"$3"} borderRadius={25} {...props}>
            {icon && React.cloneElement(icon, { size:20, strokeWidth: 0.7, color: 'var(--color)' })}
            {children}
            {text && <SizableText marginLeft={icon?"$2":"$0"} opacity={0.97} fontWeight={bold?"900":"400"} size="$1" color="$color" >{text}</SizableText>}
            {loading && <><Spacer size={9} /><Spinner color={"var(--color8)"} scale={0.7} size='small' /></>}
        </XStack>
}