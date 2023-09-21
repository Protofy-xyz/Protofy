import { Button, CardProps, Paragraph, StackProps, XStack } from "tamagui"
import OverlayCard from "./OverlayCard"
import { NextLink } from "./NextLink"
import React from "react"

const OverlayCardBasic = React.forwardRef(({ containerProps = {}, title = '', subtitle = '', href = '', caption = '', ...props }: CardProps &
{ title?: string, subtitle?: string, href?: string, caption?: string, containerProps?: StackProps }, ref: any) => (
    <XStack ref={ref} {...containerProps}>
        <OverlayCard>
            {/*@ts-ignore*/}
            {title ? <Paragraph ta="left" size="$8" fow="400" ls={-1}>
                {title}
            </Paragraph> : null}
            {/*@ts-ignore*/}
            {subtitle ? <Paragraph ta="left" size="$6" theme="alt2" fow="400">
                {subtitle}
            </Paragraph> : null}

            {href && caption ? <NextLink prefetch={false} href={href}>
                <Button
                    accessibilityLabel="Fonts docs"
                    fontFamily="$silkscreen"
                    //@ts-ignore
                    als="flex-end"
                >
                    {caption}
                </Button>
            </NextLink> : null}
            {props.children}
        </OverlayCard>
    </XStack>
))

export default OverlayCardBasic