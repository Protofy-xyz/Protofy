import { ContainerLarge } from '../Container'
import { ParagraphLink } from '../Link'
import { H4, XStack, YStack, YStackProps, Separator } from 'tamagui'

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
export const Footer = ({ children, separator = false, bottom = <></> }) => {
  return (
    <YStack tag="footer" pos="relative">
      <ContainerLarge>
        {separator && <Separator pt="$7" />}
        <XStack py="$4" $sm={{ flexDirection: 'column', ai: 'center' }}>
          {children}
        </XStack>
        {bottom}
      </ContainerLarge>
    </YStack>
  )
}
