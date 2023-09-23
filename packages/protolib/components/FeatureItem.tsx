import { CheckCircle } from "./CheckCircle"
import { Card, SizableText, XStack, Text, Paragraph } from "tamagui"
import React from "react"

const FeatureItem = React.forwardRef(({ label, children }:any, ref:any) => {
  return (
    //@ts-ignore
    <Card p="$6" elevation="$1" $sm={{ p: '$4' }} ref={ref}>
      <XStack tag="li">
        <Text color="$green9">
          <CheckCircle />
        </Text>
        <Paragraph color="$gray11">
          <SizableText>
            {/*@ts-ignore*/}
            <SizableText size="$5" fow="800">
              {label}
            </SizableText>
            &nbsp;&nbsp;-&nbsp;&nbsp;
            <SizableText size="$5" tag="span" theme="alt2">
              {children}
            </SizableText>
          </SizableText>
        </Paragraph>
      </XStack>
    </Card>

  )
})

export default FeatureItem