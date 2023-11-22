import { Check, Copy } from '@tamagui/lucide-icons'
import React, { memo } from 'react'
import { Button, Paragraph, Spacer, TooltipSimple, XStack } from 'tamagui'

import { useClipboard } from '../lib/useClipboard'

export const CopyBubble = React.forwardRef(({text, tooltipCopy='Copy to clipboard', tooltipCopied = 'Copied', ...props}:any, ref:any) => {
  const { onCopy, hasCopied } = useClipboard(text)

  return (
    <XStack
      ref={ref}
      borderWidth={1}
      borderColor="$borderColor"
      //@ts-ignore
      px="$7"
      pl="$6"
      height={48}
      ai="center"
      als="center"
      elevation="$3"
      bc="$background"
      br="$10"
      {...props}
    >
      <Paragraph
        //@ts-ignore
        ta="center"
        size="$5"
        y={1}
        fontWeight="500"
        fontFamily="$mono"
        $sm={{ size: '$3' }}
      >
        {text}
      </Paragraph>
      <Spacer size="$6" />
      <TooltipSimple label={hasCopied ? tooltipCopied : tooltipCopy}>
        <Button
          accessibilityLabel={text}
          size="$3"
          borderRadius="$8"
          //@ts-ignore
          mr="$-6"
          x={-1}
          icon={hasCopied ? Check : Copy}
          onPress={onCopy}
        />
      </TooltipSimple>
    </XStack>
  )
})