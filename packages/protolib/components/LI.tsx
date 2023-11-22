import { Paragraph, styled } from 'tamagui'

export const LI = styled(Paragraph, {
  display: 'list-item' as any,
  tag: 'li',
  //@ts-ignore
  size: '$5',
  //@ts-ignore
  pb: '$1',
})
