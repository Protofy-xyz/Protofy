import { Center, getPendingResult, PendingAtomResult, Monaco, API } from 'protolib'
import { Image, Spinner, XStack, YStack, YStackProps } from '@my/ui'
import { useEffect, useState } from 'react'
import { useThemeSetting } from '@tamagui/next-theme'
import { lookup } from 'mrmime';

export const FileWidget = ({currentFile, ...props}: {currentFile: string} & YStackProps) => {
    const url = ('/adminapi/v1/files/'+currentFile).replace(/\/+/g, '/')
    const [currentFileContent, setCurrentFileContent] = useState<PendingAtomResult>(getPendingResult('pending'))
    const {resolvedTheme} = useThemeSetting()
    const mime = lookup(currentFile)
    const type = mime ? mime.split('/')[0] : 'text'
    console.log('Opening file: ', currentFile, 'mime: ', mime, 'type: ', type, 'url: ', url)
    useEffect(() => {
        if(type == 'text' || type == 'application') {
            API.get(url, setCurrentFileContent, true)
        }
        
    }, [currentFile])
    const getComponent = () => {
        if(type == 'text' || type == 'application') {
            if(currentFileContent.isLoaded) {
                return <Monaco path={currentFile} darkMode={resolvedTheme=='dark'} sourceCode={currentFileContent.data} />
            } else if(currentFileContent.isError) {
                return <div>ERROR</div>
            } else {
                return <Center>
                        <Spinner size={'large'} scale={3} top={-50} />
                        Loading
                    </Center>
            }
        } else {
            if(type == 'image') {
                return <img src={url} />
            } else {
                return <Center>Unknown file type</Center>
            }
        }
    }

    return <YStack flex={1} alignItems='center' justifyContent='center' {...props}>
        {getComponent()}
    </YStack>
}
