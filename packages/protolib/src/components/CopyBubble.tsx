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
      paddingHorizontal="$7"
      paddingLeft="$6"
      height={48}
      alignItems="center"
      alignSelf="center"
      elevation="$3"
      backgroundColor="$background"
      borderRadius="$10"
      {...props}
    >
      <Paragraph
        //@ts-ignore
        textAlign="center"
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
          marginRight="$-6"
          x={-1}
          icon={hasCopied ? Check : Copy}
          onPress={onCopy}
        />
      </TooltipSimple>
    </XStack>
  )
})