import { IconContainer, DataCard, Center, getPendingResult, PendingAtomResult, Monaco, API } from 'protolib'
import { H2, H3, H4, Image, Paragraph, ScrollView, Spinner, Stack, XStack, YStack, YStackProps } from '@my/ui'
import React, { useEffect, useState } from 'react'
import { useThemeSetting } from '@tamagui/next-theme'
import { lookup } from 'mrmime';
import { X, XCircle } from '@tamagui/lucide-icons';
import { Scrollbars } from 'react-custom-scrollbars-2';

import dynamic from 'next/dynamic'
 
const FlowsWidget = dynamic(() => import('./FlowsWidget'), {
  loading: () => <Spinner></Spinner>,
  ssr: false
})

export const FileWidget = ({icons=[], currentFile, currentFileName, ...props }: { icons?: React.ReactElement | [], extraIcons?: React.ReactElement[],title: string, currentFile: string, currentFileName: string} & YStackProps) => {
    const url = ('/adminapi/v1/files/' + currentFile).replace(/\/+/g, '/')
    const [currentFileContent, setCurrentFileContent] = useState<PendingAtomResult>(getPendingResult('pending'))
    const { resolvedTheme } = useThemeSetting()
    const mime = lookup(currentFile)
    const type = mime ? mime.split('/')[0] : 'text'
    console.log('Opening file: ', currentFile, 'mime: ', mime, 'type: ', type, 'url: ', url)

    useEffect(() => {
        if (type == 'text' || type == 'application' || (type == 'video' && mime == 'video/mp2t')) {
            API.get(url, setCurrentFileContent, true)
        }

    }, [currentFile])

    const getComponent = () => {
        if (type == 'text' || type == 'application' || (type == 'video' && mime == 'video/mp2t')) {
            if (currentFileContent.isLoaded) {
                if (mime == 'application/json') {
                    try {
                        const data = JSON.parse(currentFileContent.data)
                        return {
                            component: <XStack f={1} width={'100%'}>
                                <DataCard
                                    extraIcons={icons}
                                    hideDeleteIcon={true}
                                    itemCardProps={{containerElement:Scrollbars, topBarProps: {top: -10, backgroundColor: 'transparent'}}}
                                    minimal={true}
                                    f={1}
                                    backgroundColor={'transprent'}
                                    onDelete={() => { }}
                                    onSave={(content) => { }}
                                    json={data}
                                    name={currentFile}
                                />
                            </XStack>, 
                            widget: 'jsonui', supportIcons: true
                        }
                    } catch (e) {

                    }
                } else if(mime == 'application/javascript' || mime == 'video/mp2t') {
                    return {
                        component: <XStack mt={30} f={1} width={"100%"}>
                            <FlowsWidget themeMode={resolvedTheme}/>
                            </XStack>,
                        widget: 'flows'
                    }
                }
                return {
                    component: <XStack mt={30} f={1} width={"100%"}>
                        <Monaco path={currentFile} darkMode={resolvedTheme == 'dark'} sourceCode={currentFileContent.data} />
                    </XStack>, 
                    widget: 'text'
                }
            } else if (currentFileContent.isError) {
                return {
                    component: <div>ERROR</div>, 
                    widget: 'error'
                }
            } else {
                return {
                    component: <Center>
                        <Spinner size={'large'} scale={3} top={-50} />
                        Loading
                    </Center>, 
                    widget: 'loading'
                }
            }
        } else {
            if (type == 'image') {
                return {component: <img src={url} />, widget: 'image'}
            } else {
                return {component: <Center>Unknown file type</Center>, widget: 'unknown'}
            }
        }
    }

    const resolved = getComponent()

    return <>
        <XStack height={20} />
        <YStack flex={1} alignItems='center' justifyContent='center' {...props}>
            {resolved.component}
        </YStack>
        <H4 position='absolute' left={15} top={10}>{currentFileName}</H4>
        {!resolved.supportIcons ?<Stack position="absolute" right={15} top={17}>
            {icons}
        </Stack>:null}
    </>
}
