import { NextLink } from './NextLink'
import { H3, Paragraph, Stack, YStack, YStackProps } from 'tamagui'

import { CodeInline } from './Code'
import { IconStack } from './IconStack'
import { useContext } from 'react'
import { HoveredGroupContext } from './HoveredGroup'
import React from 'react'


const Section = (props: YStackProps) => (
  <YStack
    //      width="33%"
    $sm={{ width: 'auto', maxWidth: 500, marginHorizontal: 'auto' }}
    flexShrink={1}
    {...props}
  />
)

export const TitleLink = React.forwardRef(({ href, children, ...props }: any, ref: any) => {
  return (
    <NextLink prefetch={false} href={href} ref={ref}>
      <H3 cursor="pointer" color="$color" marginVertical="$2">
        <CodeInline
          cursor="pointer"
          fontFamily="$silkscreen"
          bc="$color2"
          hoverStyle={{
            backgroundColor: '$color3',
          }}
          size="$9"
          fontSize="$7"
          ls={0}
          {...props}
        >
          {children}
        </CodeInline>
      </H3>
    </NextLink>
  )
})


type SectionBlockProps = {
  hoveredTheme?: string,
  nonHoveredTheme?: string
  title: any,
  icon?: any,
  children: any,
  href?: string,
  id?: number
}

const SectionBlock = React.forwardRef(({ id, title, icon, children, href, hoveredTheme, nonHoveredTheme, ...props }: YStackProps & SectionBlockProps, ref:any) => {
  const { hovered, setHovered } = useContext(HoveredGroupContext);
  return (
    <Stack flex={1} ref={ref}>
      {/*@ts-ignore*/}
      <Section theme={hovered == id ? hoveredTheme : nonHoveredTheme} onHoverIn={id !== undefined ? () => setHovered(id) : () => { }} {...props}>
        {icon ? <IconStack>
          {icon}
        </IconStack> : null}
        {title ? <TitleLink href={href}>{title}</TitleLink> : null}
        <Paragraph opacity={0.7} size="$4">
          {children}
        </Paragraph>
      </Section>
    </Stack>
  )
})

export default SectionBlock