import { NextLink, Logo, ContainerLarge, ExternalIcon, ParagraphLink } from 'protolib'
import React from 'react'
import { H4, Paragraph, Text, XStack, YStack } from 'tamagui'

export const Footer = () => {
  return (
    <YStack tag="footer" pos="relative">
      <ContainerLarge>
        <XStack py="$7" $sm={{ flexDirection: 'column', ai: 'center' }}>
          <YStack
            ai="flex-start"
            $sm={{ ai: 'center' }}
            py="$5"
            flex={2}
            mt="$-1"
            mb="$2"
            px="$4"
            space="$4"
          >
            <Text
              className="clip-invisible"
              position="absolute"
              width={1}
              height={1}
              padding={0}
              margin={-1}
              overflow="hidden"
            >
              homepage
            </Text>
            <NextLink href="/" aria-label="Homepage">
              <Logo text='Protofy' />
            </NextLink>
            <Paragraph mt="$2" size="$3">
              Made with love
            </Paragraph>
          </YStack>

          <YStack
            ai="flex-start"
            $sm={{ ai: 'center' }}
            px="$4"
            py="$5"
            flex={1.5}
            space="$3"
          >
            <H4 mb="$3" size="$4" fontFamily="$silkscreen">
              Overview
            </H4>
            <ParagraphLink href="/docs/intro/introduction">Introduction</ParagraphLink>
            <ParagraphLink href="/docs/core/configuration">Configuration</ParagraphLink>
            <ParagraphLink href="/docs/guides/design-systems">Guides</ParagraphLink>
            {/* <ParagraphLink href="/docs/api">API</ParagraphLink>
          <ParagraphLink href="/docs/frequently-asked-questions">FAQ</ParagraphLink> */}
          </YStack>

          <YStack
            ai="flex-start"
            $sm={{ ai: 'center' }}
            px="$4"
            py="$5"
            flex={1.5}
            space="$3"
          >
            <H4 mb="$3" size="$4" fontFamily="$silkscreen">
              Docs
            </H4>
            <ParagraphLink href="/docs/intro/installation">Installation</ParagraphLink>
            <ParagraphLink href="/docs/intro/themes">Themes</ParagraphLink>
            <ParagraphLink href="/docs/core/styled">Variants</ParagraphLink>
          </YStack>

          <YStack
            ai="flex-start"
            $sm={{ ai: 'center' }}
            px="$4"
            py="$5"
            flex={1.5}
            space="$3"
          >
            <H4 mb="$3" size="$4" fontFamily="$silkscreen">
              Community
            </H4>
            <XStack space="$1" ai="center">
              <ParagraphLink href="/community">Community</ParagraphLink>
            </XStack>
            <XStack space="$1" ai="center">
              <ParagraphLink href="/blog">Blog</ParagraphLink>
            </XStack>
            <XStack space="$1" ai="center">
              <ParagraphLink href="https://github.com/Protofy-xyz" target="_blank">
                GitHub
              </ParagraphLink>
              <ExternalIcon />
            </XStack>
            <XStack space="$1" ai="center">
              <ParagraphLink href="https://twitter.com/tamagui_js" target="_blank">
                Twitter
              </ParagraphLink>
              <ExternalIcon />
            </XStack>
            <XStack space="$1" ai="center">
              <ParagraphLink href="https://discord.gg/4qh6tdcVDa" target="_blank">
                Discord
              </ParagraphLink>
              <ExternalIcon />
            </XStack>
          </YStack>
        </XStack>
      </ContainerLarge>
    </YStack>
  )
}
