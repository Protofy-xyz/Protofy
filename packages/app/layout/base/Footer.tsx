import { ContainerLarge } from 'protolib/dist/components/Container'
import { ParagraphLink } from 'protolib/dist/components/Link'
import { H4, XStack, YStack, YStackProps } from 'tamagui'

export const FooterLink = ({href, children}) => <ParagraphLink href={href}>{children}</ParagraphLink>

export const FooterElement = ({title, links=[], children, ...props}: {title?: any, links?: {href: string, caption: any}[]} & YStackProps) => {
    return <YStack
    alignItems="flex-start"
    $sm={{ alignItems: 'center' }}
    paddingHorizontal="$4"
    paddingVertical="$5"
    flex={1.5}
    space="$3"
    {...props}
  >
    {title && <H4 marginBottom="$3" size="$4" fontFamily="$silkscreen">
      {title}
    </H4> }
    {links.map((ele, i) => <FooterLink key={i} href={ele.href}>{ele.caption}</FooterLink>)}
    {children}
  </YStack>
}
export const Footer = ({children}) => {
  return (
    <YStack tag="footer" position="relative">
      <ContainerLarge>
        <XStack paddingVertical="$7" $sm={{ flexDirection: 'column', alignItems: 'center' }}>
            {children}
        </XStack>
      </ContainerLarge>
    </YStack>
  )
}
