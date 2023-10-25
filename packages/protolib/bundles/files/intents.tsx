import { Spinner, XStack } from 'tamagui'
import { DataCard } from '../../components/DataCard'
import { Scrollbars } from 'react-custom-scrollbars-2';
import AsyncView from '../../components/AsyncView'
import { useFileFromAPI } from '../../lib/useFileFromAPI'
import { IconContainer } from '../../components/IconContainer'
import { Save } from '@tamagui/lucide-icons';
import { useThemeSetting } from '@tamagui/next-theme'
// import FlowsWidget from '../../adminpanel/features/components/FlowsWidget'
// import GLTFViewer from '../../adminpanel/features/components/ModelViewer'
import { Monaco } from '../../components/Monaco'
import {IntentType} from '../../lib/Intent'
import Center from '../../components/Center'
import dynamic from 'next/dynamic'

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

const FlowsViewer = ({ isFull, path, isModified, setIsModified }) => {
    const [fileContent, setFileContent] = useFileFromAPI(path)
    const { resolvedTheme } = useThemeSetting()
    console.log('data: ', fileContent)
    return <AsyncView atom={fileContent}>
            <XStack mt={isFull ? 50 : 30} f={1} width={"100%"}>
                {/* <Theme name={tint as any}> */}
                <FlowsWidget
                    icons={<XStack position="absolute" right={isFull ? 0 : 50} top={isFull ? -35 : -32}>
                        <IconContainer onPress={() => { }}>
                            {/* <SizableText mr={"$2"}>Save</SizableText> */}
                            <Save color="var(--color)" size={isFull ? "$2" : "$1"} />
                        </IconContainer>
                    </XStack>}
                    isModified={isModified}
                    setIsModified={setIsModified}
                    setSourceCode={(sourceCode) => {
                        console.log('set new sourcecode from flows: ', sourceCode)
                    }} sourceCode={fileContent.data} path={path} themeMode={resolvedTheme} />
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
        return { component: <FlowsViewer {...data} />, supportIcons: false }
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
    } else if(type == 'image') {
        return {component: <img src={url} />, widget: 'image'}
    }
}