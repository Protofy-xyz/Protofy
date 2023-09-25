import { IconContainer, DataCard, Center, getPendingResult, PendingAtomResult, Monaco, API } from 'protolib'
import { H2, H3, H4, Image, Paragraph, ScrollView, Spinner, XStack, YStack, YStackProps } from '@my/ui'
import React, { useEffect, useState } from 'react'
import { useThemeSetting } from '@tamagui/next-theme'
import { lookup } from 'mrmime';
import { X, XCircle } from '@tamagui/lucide-icons';

export const FileWidget = ({extraIcons=[], currentFile, currentFileName, ...props }: { extraIcons: React.ReactElement[],title: string, currentFile: string, currentFileName: string} & YStackProps) => {
    const url = ('/adminapi/v1/files/' + currentFile).replace(/\/+/g, '/')
    const [currentFileContent, setCurrentFileContent] = useState<PendingAtomResult>(getPendingResult('pending'))
    const { resolvedTheme } = useThemeSetting()
    const mime = lookup(currentFile)
    const type = mime ? mime.split('/')[0] : 'text'
    console.log('Opening file: ', currentFile, 'mime: ', mime, 'type: ', type, 'url: ', url)
    useEffect(() => {
        if (type == 'text' || type == 'application') {
            API.get(url, setCurrentFileContent, true)
        }

    }, [currentFile])
    const getComponent = () => {
        if (type == 'text' || type == 'application') {
            if (currentFileContent.isLoaded) {

                if (mime == 'application/json') {
                    try {
                        const data = JSON.parse(currentFileContent.data)
                        return <XStack f={1} width={'100%'}>
                            <DataCard
                            extraIcons={extraIcons}
                            hideDeleteIcon={true}
                            itemCardProps={{topBarProps: {top: -10, backgroundColor: 'transparent'}}}
                            minimal={true}
                            f={1}
                            backgroundColor={'transprent'}
                            onDelete={() => { }}
                            onSave={(content) => { }}
                            json={data}
                            name={currentFile}
                        />
                            </XStack>
                    } catch (e) {

                    }


                }
                return <XStack mt={30} f={1} width={"100%"}>
                        <Monaco path={currentFile} darkMode={resolvedTheme == 'dark'} sourceCode={currentFileContent.data} />
                    </XStack>
            } else if (currentFileContent.isError) {
                return <div>ERROR</div>
            } else {
                return <Center>
                    <Spinner size={'large'} scale={3} top={-50} />
                    Loading
                </Center>
            }
        } else {
            if (type == 'image') {
                return <img src={url} />
            } else {
                return <Center>Unknown file type</Center>
            }
        }
    }

    return <>
        <XStack height={20} />
        <YStack flex={1} alignItems='center' justifyContent='center' {...props}>
            {getComponent()}
        </YStack>
        <H4 position='absolute' left={15} top={10}>{currentFileName}</H4>
    </>
}
