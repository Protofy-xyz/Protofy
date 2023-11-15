import { Spinner, XStack } from 'tamagui'
import { DataCard } from '../../components/DataCard'
import { Scrollbars } from 'react-custom-scrollbars-2';
import AsyncView from '../../components/AsyncView'
import { useFileFromAPI } from '../../lib/useFileFromAPI'
import { IconContainer } from '../../components/IconContainer'
import { Save, Workflow, Code} from '@tamagui/lucide-icons';
import { useThemeSetting } from '@tamagui/next-theme'
// import FlowsWidget from '../../adminpanel/features/components/FlowsWidget'
// import GLTFViewer from '../../adminpanel/features/components/ModelViewer'
import { Monaco } from '../../components/Monaco'
import { IntentType } from '../../lib/Intent'
import Center from '../../components/Center'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react';
import { API } from '../../lib/Api';

const FlowsWidget = dynamic(() => import('../../adminpanel/features/components/FlowsWidget'), {
    loading: () => <Center>
        <Spinner size={'large'} scale={3} top={-50} />
        Loading
    </Center>,
    ssr: false
})

const GLTFViewer = dynamic(() => import('../../adminpanel/features/components/ModelViewer'), {
    loading: () => <Center>
        <Spinner size={'large'} scale={3} top={-50} />
        Loading
    </Center>,
    ssr: false
})

const JSONViewer = ({ extraIcons, name, path }) => {
    const [fileContent, setFileContent] = useFileFromAPI(path)
    console.log('file content: ', fileContent)
    const data = fileContent.isLoaded ? JSON.parse(fileContent.data) : ''
    return <AsyncView waitForLoading={1000} key={path} atom={fileContent}>
        <XStack f={1} width={'100%'}>
            <DataCard
                extraIcons={extraIcons}
                hideDeleteIcon={true}
                itemCardProps={{ containerElement: Scrollbars, topBarProps: { top: -10, backgroundColor: 'transparent' } }}
                minimal={true}
                f={1}
                backgroundColor={'transprent'}
                onDelete={() => { }}
                onSave={(content) => { }}
                json={data}
                name={name}
            />
        </XStack>
    </AsyncView>
}

const FlowsViewer = ({ extraIcons, isFull, path, isModified, setIsModified }) => {
    const [fileContent] = useFileFromAPI(path)
    const [loaded, setLoaded] = useState(false)
    const sourceCode = useRef('')

    useEffect(() => {
        if(fileContent.isLoaded) {
            sourceCode.current = fileContent.data
            setLoaded(true)
        }
    }, [fileContent]);

    const { resolvedTheme } = useThemeSetting()
    const [mode, setMode] = useState('code')

    const onSave = async () => {
        await API.post('/adminapi/v1/files/'+path.replace(/\/+/g, '/'), {content:sourceCode.current})
    }
    return <AsyncView atom={fileContent}>
        <XStack mt={isFull ? 50 : 30} f={1} width={"100%"}>
            {/* <Theme name={tint as any}> */}
            <XStack position="absolute" right={isFull ? 0 : 20} top={isFull ? -35 : -32}>
                {mode == 'code' ? <IconContainer onPress={() => setMode('flow')}>
                    {/* <SizableText mr={"$2"}>Save</SizableText> */}
                    <Workflow color="var(--color)" size={isFull ? "$2" : "$1"} />
                </IconContainer>:
                <IconContainer onPress={() => setMode('code')}>
                    {/* <SizableText mr={"$2"}>Save</SizableText> */}
                    <Code color="var(--color)" size={isFull ? "$2" : "$1"} />
                </IconContainer>}
                <IconContainer onPress={onSave}>
                    {/* <SizableText mr={"$2"}>Save</SizableText> */}
                    <Save color="var(--color)" size={isFull ? "$2" : "$1"} />
                </IconContainer>
                {extraIcons}
            </XStack>
            {mode == 'code' ? <Monaco path={path} darkMode={resolvedTheme == 'dark'} sourceCode={sourceCode.current} onChange={(code) => {sourceCode.current = code}} />: <FlowsWidget
                isModified={isModified}
                onEdit={(code) => {sourceCode.current = code}}
                setIsModified={setIsModified}
                setSourceCode={(sourceCode) => {
                    sourceCode.current = sourceCode
                }} sourceCode={sourceCode.current} path={path} themeMode={resolvedTheme} />}
                <XStack opacity={0} top={-200000} position={"absolute"}>
                    <FlowsWidget preload={true} />
                </XStack>
            {/* </Theme> */}
        </XStack>
    </AsyncView>
}

const MonacoViewer = ({ path }) => {
    const [fileContent, setFileContent] = useFileFromAPI(path)
    const { resolvedTheme } = useThemeSetting()
    return <AsyncView waitForLoading={1000} key={path} atom={fileContent}>
        <XStack mt={30} f={1} width={"100%"}>
            <Monaco path={path} darkMode={resolvedTheme == 'dark'} sourceCode={fileContent.data} />
        </XStack>
    </AsyncView>
}

export const processFilesIntent = ({ action, domain, data }: IntentType) => {
    const { mime } = data
    const type = mime ? mime.split('/')[0] : 'text'
    const url = ('/adminapi/v1/files/' + data.path).replace(/\/+/g, '/')
    if (mime == 'application/json') {
        return { component: <JSONViewer {...data} />, supportIcons: true }
    } else if (mime == 'application/javascript' || mime == 'video/mp2t') {
        return { component: <FlowsViewer {...data} />, supportIcons: true }
    } else if (mime == 'model/gltf-binary') {
        return {
            component: <GLTFViewer path={url} />,
            widget: 'text'
        }
    } else if (type == 'text' || type == 'application') {
        return {
            component: <MonacoViewer path={data.path} />,
            widget: 'text'
        }
    } else if (type == 'image') {
        return { component: <img src={url} />, widget: 'image' }
    }
}