import React from "react"
import { Button, ButtonProps, ButtonText, TextProps } from "@my/ui"

type MainButtonProps = {
  buttonProps?: ButtonProps
  buttonTextProps?: TextProps,
  color?: string,
  textColor?: string,
  children: any
}

export const MainButton = React.forwardRef(({ buttonProps = {}, buttonTextProps = {}, color = undefined, textColor = undefined,  children }: MainButtonProps, ref: any) => (
  <Button
    ref={ref}
    // layout shifts...
    accessibilityLabel="Get started (docs)"
    fontFamily="$silkscreen"
    size="$5"
    borderRadius={1000}
    bordered
    //@ts-ignore
    bw={2}
    mx="$2"
    tabIndex="0"
    elevation="$1"
    letterSpacing={-2}
    pressStyle={{
      elevation: '$0',
    }}
    backgroundColor={color}
    
    {...buttonProps}
  >
    <ButtonText color={textColor} fontFamily="$silkscreen" size="$7" letterSpacing={1} {...buttonTextProps}>
      {children}
    </ButtonText>
  </Button>
))

export default MainButton