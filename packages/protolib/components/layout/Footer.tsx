import { NextLink, Logo, ContainerLarge, ExternalIcon, ParagraphLink } from 'protolib'
import { H4, Paragraph, Text, XStack, YStack, YStackProps } from 'tamagui'

export const FooterLink = ({href, children}) => <ParagraphLink href={href}>{children}</ParagraphLink>

export const FooterElement = ({title, links=[], children, ...props}: {title?: any, links?: {href: string, caption: any}[]} & YStackProps) => {
    return <YStack
    ai="flex-start"
    $sm={{ ai: 'center' }}
    px="$4"
    py="$5"
    flex={1.5}
    space="$3"
    {...props}
  >
    {title && <H4 mb="$3" size="$4" fontFamily="$silkscreen">
      {title}
    </H4> }
    {links.map((ele, i) => <FooterLink key={i} href={ele.href}>{ele.caption}</FooterLink>)}
    {children}
  </YStack>
}
export const Footer = ({children}) => {
  return (
    <YStack tag="footer" pos="relative">
      <ContainerLarge>
        <XStack py="$7" $sm={{ flexDirection: 'column', ai: 'center' }}>
            {children}
        </XStack>
      </ContainerLarge>
    </YStack>
  )
}
