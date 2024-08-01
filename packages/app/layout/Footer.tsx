import { NextLink } from 'protolib/components/NextLink'
import { Logo } from 'protolib/components/Logo'
import { Footer as ProtoFooter, FooterElement } from 'protolib/components/layout/Footer'
import { DiscordIcon } from 'protolib/components/icons/DiscordIcon'
import { GithubIcon } from 'protolib/components/icons/GithubIcon'
import React from 'react'
import { Instagram, Linkedin } from 'lucide-react'
import { XStack, Separator, Text, TextProps } from '@my/ui'

const FooterText = (props: TextProps) => <Text fontWeight={200} {...props} />
export const Footer = () => <ProtoFooter
  separator={true}
  bottom={<>
    <Separator pt="$2"></Separator>
    <XStack gap="$4" flexWrap="wrap" f={1} py="$2" px="$4" jc='space-between' $sm={{ jc: 'center' }} ai="center">
      <NextLink href="/cookies" aria-label="Cookie policy">
        <FooterText $sm={{ ta: 'center' }} width="300px" color="$color10">
          Cookie policy
        </FooterText>
      </NextLink>
      <FooterText width="300px" ta="right" $sm={{ ta: 'center' }}>
        made with love
      </FooterText>
    </XStack>
  </>}
>
  <FooterElement
    gap="5px"
    width="300px"
  >
    <FooterText>
      hello@protofy.xyz
    </FooterText>
    <FooterText>
      +34 935 16 51 44
    </FooterText>
    <FooterText>
      C/Ramón Turró 100, 1º 1ª
    </FooterText>
    <FooterText>
      Barcelona, Spain
    </FooterText>
  </FooterElement>
  <FooterElement
    gap="5px"
    width="300px"
    alignItems='center'
  >
    <NextLink href="https://www.protofy.xyz/" aria-label="Platform">
      <FooterText fontWeight={400}>
        Platform
      </FooterText>
    </NextLink>
    <NextLink href="https://www.protofy.xyz/join" aria-label="Cloud">
      <FooterText fontWeight={400}>
        Cloud
      </FooterText>
    </NextLink>
    <NextLink href="https://projects.protofy.xyz/" aria-label="Projects">
      <FooterText fontWeight={400}>
        Projects
      </FooterText>
    </NextLink>
  </FooterElement>
  <FooterElement
    gap="5px"
    alignItems='flex-end'
    width="300px"
  >
    <FooterText>
      © 2024 | All rights reserved
    </FooterText>
    <FooterText>
      Protofy
    </FooterText>
    <XStack mt="$4" gap="$4" ai="center">
      <NextLink href="https://github.com/Protofy-xyz/Protofy" aria-label="Github">
        <GithubIcon width={24} />
      </NextLink>
      <NextLink href="https://discord.gg/VpeZxMFfYW" aria-label="Discord">
        <DiscordIcon width={24} />
      </NextLink>
      <NextLink href="https://www.instagram.com/protofy.xyz/" aria-label="Instagram">
        <Instagram color={"var(--color)"} size={24} />
      </NextLink>
      <NextLink href="https://es.linkedin.com/company/protofy-xyz" aria-label="Linkedin">
        <Linkedin color={"var(--color)"} size={24} />
      </NextLink>
    </XStack>
  </FooterElement>
</ProtoFooter>
