import { getIntent, Center, getPendingResult, PendingAtomResult, useTint} from 'protolib'
import { H4, Spinner, Stack, XStack, YStack, YStackProps } from '@my/ui'
import React, { useState } from 'react'
import { useThemeSetting } from '@tamagui/next-theme'
import { lookup } from 'mrmime';
import { ChonkyActions } from 'chonky';
import { setChonkyDefaults } from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import dynamic from 'next/dynamic'
import {processIntent} from 'app/bundles/intents'
 
setChonkyDefaults({ iconComponent: ChonkyIconFA });
//@ts-ignore
ChonkyActions.ToggleHiddenFiles.option.defaultValue = false;

export const FileWidget = ({isFull, hideCloseIcon, isModified=false, setIsModified=() => {}, icons=[], currentFile, currentFileName, ...props }: { isFull: boolean, hideCloseIcon: boolean, headerStart: number, isModified: boolean, setIsModified: any, icons?: React.ReactElement | [], extraIcons?: React.ReactElement[],title: string, currentFile: string, currentFileName: string} & YStackProps) => {
    const url = ('/adminapi/v1/files/' + currentFile).replace(/\/+/g, '/')
    const [currentFileContent, setCurrentFileContent] = useState<PendingAtomResult>(getPendingResult('pending'))
    const { resolvedTheme } = useThemeSetting()
    const mime = lookup(currentFile)
    const {tint} = useTint()

    const resolved = processIntent(getIntent('open', 'files', {isModified, isFull, extraIcons: icons, name: currentFileName, path: currentFile, mime}))

    return <>
        <XStack height={20} />
        <YStack flex={1} alignItems='center' justifyContent='center' {...props}>
            {resolved? resolved.component: <Center>No viewer exists for this file type</Center>}
        </YStack>
        <H4 position='absolute' left={15} top={10}>{currentFileName}</H4>
        {(!resolved || !resolved.supportIcons) && !hideCloseIcon ?<Stack position="absolute" right={15} top={17}>
            {icons}
        </Stack>:null}
    </>
}
