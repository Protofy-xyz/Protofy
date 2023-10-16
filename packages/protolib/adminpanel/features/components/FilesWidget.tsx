import { IconContainer, DataCard, Center, getPendingResult, PendingAtomResult, Monaco, API } from 'protolib'
import { H2, H3, H4, Image, Paragraph, ScrollView, Spinner, Stack, Theme, XStack, YStack, YStackProps } from '@my/ui'
import React, { useEffect, useState } from 'react'
import { useThemeSetting } from '@tamagui/next-theme'
import { lookup } from 'mrmime';
import { Save, X, XCircle } from '@tamagui/lucide-icons';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { useTint } from '@tamagui/logo'
import { ChonkyActions } from 'chonky';
import { setChonkyDefaults } from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import dynamic from 'next/dynamic'
import GLTFViewer from './ModelViewer';
 
setChonkyDefaults({ iconComponent: ChonkyIconFA });
//@ts-ignore
ChonkyActions.ToggleHiddenFiles.option.defaultValue = false;

const FlowsWidget = dynamic(() => import('./FlowsWidget'), {
  loading: () => <Center>
  <Spinner size={'large'} scale={3} top={-50} />
  Loading
</Center>,
  ssr: false
})

export const FileWidget = ({isFull, hideCloseIcon, isModified=false, setIsModified=() => {}, icons=[], currentFile, currentFileName, ...props }: { isFull: boolean, hideCloseIcon: boolean, headerStart: number, isModified: boolean, setIsModified: any, icons?: React.ReactElement | [], extraIcons?: React.ReactElement[],title: string, currentFile: string, currentFileName: string} & YStackProps) => {
    const url = ('/adminapi/v1/files/' + currentFile).replace(/\/+/g, '/')
    const [currentFileContent, setCurrentFileContent] = useState<PendingAtomResult>(getPendingResult('pending'))
    const { resolvedTheme } = useThemeSetting()
    const mime = lookup(currentFile)
    const {tint} = useTint()
    const type = mime ? mime.split('/')[0] : 'text'
    // console.log('Opening file: ', currentFile, 'mime: ', mime, 'type: ', type, 'url: ', url)

    useEffect(() => {
        if (type == 'text' || type == 'application' || (type == 'video' && mime == 'video/mp2t' || mime == 'model/gltf-binary')) {
            API.get(url, setCurrentFileContent, true)
        }

    }, [currentFile])

    const getComponent = () => {
        if (type == 'text' || type == 'application' || (type == 'video' && mime == 'video/mp2t' || mime == 'model/gltf-binary')) {
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
                        component: <XStack mt={isFull?50:30} f={1} width={"100%"}>
                            {/* <Theme name={tint as any}> */}
                                <FlowsWidget 
                                    icons={<XStack position="absolute" right={isFull?0:50} top={isFull?-35:-32}>
                                    <IconContainer onPress={() => {}}>
                                        {/* <SizableText mr={"$2"}>Save</SizableText> */}
                                        <Save color="var(--color)" size={isFull?"$2":"$1"} />
                                    </IconContainer>
                                </XStack>}
                                    isModified={isModified}
                                    setIsModified={setIsModified}
                                    setSourceCode={(sourceCode) => {
                                        console.log('set new sourcecode from flows: ', sourceCode)
                                    }} sourceCode={currentFileContent.data} path={currentFile} themeMode={resolvedTheme}/>
                                {/* </Theme> */}
                            </XStack>,
                        widget: 'flows'
                    }
                } else if (mime == 'model/gltf-binary') {
                    return {
                        component: <GLTFViewer path={url} />, 
                        widget: 'text'
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
        {!resolved.supportIcons && !hideCloseIcon ?<Stack position="absolute" right={15} top={17}>
            {icons}
        </Stack>:null}
    </>
}
