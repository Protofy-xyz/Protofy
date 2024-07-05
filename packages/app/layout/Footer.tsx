import { NextLink } from 'protolib/components/NextLink'
import { Logo } from 'protolib/components/Logo'
import { Footer as ProtoFooter, FooterElement } from 'protolib/components/layout/Footer'
import React from 'react'
import { Paragraph } from 'tamagui'

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
    { href: '#', caption: 'Introduction' },
    { href: '#', caption: 'Design Principles' },
    { href: '#', caption: 'Architecture' }
  ]} />

  <FooterElement title="Links" links={[
    { href: 'https://github.com/Protofy-xyz/Protofy/blob/main/README.md', caption: 'Installation' },
    { href: 'https://github.com/Protofy-xyz/Protofy/issues', caption: 'Issues' },
    { href: 'https://github.com/Protofy-xyz/Protofy/pulls', caption: 'Pull requests' }
  ]} />

  <FooterElement title="Community" links={[
    { href: '/community', caption: 'Community' },
    { href: '/', caption: 'Site' },
    { href: 'https://github.com/Protofy-xyz/Protofy', caption: 'GitHub' },
    { href: 'https://twitter.com/protofy_xyz', caption: 'Twitter' },
    { href: 'https://discord.gg/VpeZxMFfYW', caption: 'Discord' }
  ]} />
</ProtoFooter>
