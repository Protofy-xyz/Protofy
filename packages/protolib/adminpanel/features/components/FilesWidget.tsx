import { Center } from '../../../components/Center'
import { getIntent } from '../../../lib/Intent'
import { H4, Stack, XStack, YStack, YStackProps } from '@my/ui'
import React from 'react'
import { lookup } from 'mrmime';
import { ChonkyActions } from 'chonky';
import { setChonkyDefaults } from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import { useIntent } from 'app/bundles/intents'

setChonkyDefaults({ iconComponent: ChonkyIconFA });
//@ts-ignore
ChonkyActions.ToggleHiddenFiles.option.defaultValue = false;

type FilesWidget = {
    hideCloseIcon: boolean,
    headerStart?: number,
    isModified: boolean,
    setIsModified: any,
    icons?: React.ReactElement[] | [],
    extraIcons?: React.ReactElement[],
    title?: string,
    currentFile: string,
    currentFileName: string
}

export const FileWidget = ({
    hideCloseIcon,
    isModified = false,
    setIsModified = () => { },
    icons = [],
    currentFile,
    currentFileName,
    ...props
}: FilesWidget & YStackProps) => {
    const mime = lookup(currentFile)
    if(currentFile === '') return <></>
    const resolved = useIntent(getIntent('open', 'files', { isModified, extraIcons: icons, name: currentFileName, path: currentFile, mime }))

    return <>
        <XStack height={20} />
        <YStack flex={1} alignItems='center' justifyContent='center' {...props}>
            {resolved ? resolved.component : <Center>No viewer exists for this file type</Center>}
        </YStack>
        <H4 position='absolute' left={15} top={10}>{currentFileName}</H4>
        {(!resolved || !resolved.supportIcons) && !hideCloseIcon ? <Stack position="absolute" right={15} top={17}>
            {icons}
        </Stack> : null}
    </>
}
