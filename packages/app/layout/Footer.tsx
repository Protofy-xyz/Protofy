import { NextLink, Logo, ContainerLarge, ExternalIcon, FooterElement, Footer as ProtoFooter } from 'protolib'
import React from 'react'
import { H4, Paragraph, Text, XStack, YStack } from 'tamagui'

export const Footer = () => <ProtoFooter>
  <FooterElement
    flex={2}
    mt="$-1"
    mb="$2"
    space="$4"
  >
    <NextLink href="/" aria-label="Homepage">
      <Logo text='Protofy' />
    </NextLink>
    <Paragraph mt="$2" size="$3">
      Made with love
    </Paragraph>
  </FooterElement>

  <FooterElement title="Overview" links={[
    { href: '/docs/intro/introduction', caption: 'Introduction' },
    { href: '/docs/core/configuration', caption: 'Configuration' },
    { href: '/docs/guides/design-systems', caption: 'Guides' }
  ]} />

  <FooterElement title="Docs" links={[
    { href: '/docs/intro/installation', caption: 'Installation' },
    { href: '/docs/intro/themes', caption: 'Themes' },
    { href: '/docs/core/styled', caption: 'Variants' }
  ]} />

  <FooterElement title="Community" links={[
    { href: '/community', caption: 'Community' },
    { href: '/blog', caption: 'Blog' },
    { href: 'https://github.com/Protofy-xyz', caption: 'GitHub' },
    { href: 'https://twitter.com/tamagui_js', caption: 'Twitter' },
    { href: 'https://discord.gg/4qh6tdcVDa', caption: 'Discord' }
  ]} />
</ProtoFooter>
