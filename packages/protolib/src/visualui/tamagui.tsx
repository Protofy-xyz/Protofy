import { Text, Spacer, YStack, XStack, Paragraph, Grid, Theme } from 'tamagui'
import { BasicPlaceHolder, getComponentWrapper } from './visualuiWrapper'

const cw = getComponentWrapper('tamagui')

export const tamaguiComponents = { 
    ...cw(Text, 'Type', 'Text', {children: 'Lorem ipsum', fontSize: 20}),
    ...cw(Spacer, 'Space', 'Spacer', {size: "$4"}),
    ...cw(YStack, 'Rows', 'YStack', {}, {}, { children: <BasicPlaceHolder /> }),
    ...cw(XStack, 'Columns', 'XStack', {}, {}, { children: <BasicPlaceHolder /> }),
    ...cw(Paragraph, 'Pilcrow', 'Paragraph', {children: 'Hello World', fontSize: 16 }),
    ...cw(Grid, 'LayoutGrid', 'Grid', {gap: 25, itemMinWidth: 280}, {}, { children: <BasicPlaceHolder /> }),
    ...cw(Theme, 'EyeOff', 'Theme', {}, {}, { children: <BasicPlaceHolder /> })
}