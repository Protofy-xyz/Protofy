import { Spinner, XStack } from 'tamagui'
import { DataCard } from '../../components/DataCard'
import AsyncView from '../../components/AsyncView'
import { useFileFromAPI } from '../../lib/useFileFromAPI'
import { IconContainer } from '../../components/IconContainer'
import { Save, Workflow, Code } from '@tamagui/lucide-icons';
import { useThemeSetting } from '@tamagui/next-theme'
// import FlowsWidget from '../../adminpanel/features/components/FlowsWidget'
// import GLTFViewer from '../../adminpanel/features/components/ModelViewer'
import { Monaco } from '../../components/Monaco'
import { IntentType } from '../../lib/Intent'
import Center from '../../components/Center'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react';
import { API } from '../../lib/Api';
import { usePrompt, promptCmd } from '../../context/PromptAtom';
import { useUpdateEffect } from 'usehooks-ts';

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
                itemCardProps={{topBarProps: { top: -10, backgroundColor: 'transparent' } }}
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

const SaveButton = ({ path, getContent, positionStyle }) => {
    const onSave = async () => {
        const content = getContent();
        await API.post('/adminapi/v1/files/' + path.replace(/\/+/g, '/'), { content });
    };

    return (
        <XStack position="absolute" {...positionStyle}>
            <IconContainer onPress={onSave}>
                <Save color="var(--color)" size={"$1"} />
            </IconContainer>
        </XStack>
    );
};

const FlowsViewer = ({ extraIcons, isFull, path, isModified, setIsModified }) => {
    const [fileContent, setFileContent] = useFileFromAPI(path)
    const [newFileContent, setNewFileContent] = useState('')
    const [loaded, setLoaded] = useState(false)
    const sourceCode = useRef('')

    const [promptResponse, setPromptResponse] = usePrompt(
        (prompt, total, image) => {
            const isGenerate = prompt.startsWith('/code')
            const prefix = `The user is viewing a sourceCode file named: ${path}. The content of the sourceFile is: ${sourceCode.current}`
            const suffix = isGenerate? `
The user has generated a request to change the sourceCode content. You need to fulfill the request. Reply only with source code with prefix: [code] and nothing else. Your response will be used directly to replace the content of the sourceFile, but adaptaed to what the user requested.
For example, if the final code you decide to generate is "console.log('test');" then your anser should be [code]console.log('test');
Keep the original sourcecode comments when generating new code;
If you are unable to generate the source code (too ambiguous/unespecific/whaterver reason), explain why in natural language, but do not include [code] at the beginning.
Remember to generate a response for the request that is only sourceCode and prefixed with [code]. Your response will be used to feed another program, that expects just [code] and sourceCode.
If you include anything else in your message (like reasonings or natural language) it will be considered that you are rejecting the request, and the reasons will be shown to the user.
            `:''
            return suffix+prefix
        },

        () => promptCmd({cmd: '/code', format: "sourceCode", action: "generates a source code solution in source code format of the current file."}),
    ) 

    useUpdateEffect(() => {
        console.log('Response prompt: ', promptResponse)
        if(promptResponse.startsWith("[code]")) {
            console.log('Replacing code with updated code')
            const response = promptResponse.substring("[code]".length)
            setNewFileContent(response)
            sourceCode.current = response;
        }
    }, [promptResponse])
    
    useEffect(() => {
        if (fileContent.isLoaded) {
            sourceCode.current = fileContent.data
            setLoaded(true)
        }
    }, [fileContent]);

    const { resolvedTheme } = useThemeSetting()
    const [mode, setMode] = useState('code')

    return <AsyncView atom={fileContent}>
        <XStack mt={isFull ? 50 : 30} f={1} width={"100%"}>
            {/* <Theme name={tint as any}> */}
            <XStack position="absolute" right={isFull ? 0 : 20} top={isFull ? -35 : -32}>
                {mode == 'code' ? <IconContainer onPress={() => setMode('flow')}>
                    {/* <SizableText mr={"$2"}>Save</SizableText> */}
                    <Workflow color="var(--color)" size={isFull ? "$2" : "$1"} />
                </IconContainer> :
                    <IconContainer onPress={() => setMode('code')}>
                        {/* <SizableText mr={"$2"}>Save</SizableText> */}
                        <Code color="var(--color)" size={isFull ? "$2" : "$1"} />
                    </IconContainer>}
                <SaveButton
                    path={path}
                    getContent={() => sourceCode.current}
                    positionStyle={{ position: "relative" }}
                />
                {extraIcons}
            </XStack>
            {mode == 'code' ? <Monaco path={path} darkMode={resolvedTheme == 'dark'} sourceCode={newFileContent ? newFileContent : sourceCode.current} onChange={(code) => { sourceCode.current = code }} /> : <FlowsWidget
                isModified={isModified}
                onEdit={(code) => { sourceCode.current = code }}
                setIsModified={setIsModified}
                setSourceCode={(sourceCode) => {
                    sourceCode.current = sourceCode
                }} sourceCode={newFileContent ? newFileContent : sourceCode.current} path={path} themeMode={resolvedTheme} />}
            <XStack opacity={0} top={-200000} position={"absolute"}>
                <FlowsWidget preload={true} />
            </XStack>
            {/* </Theme> */}
        </XStack>
    </AsyncView>
}

const MonacoViewer = ({ path }) => {
    const [fileContent] = useFileFromAPI(path)
    const sourceCode = useRef(''); 
    const { resolvedTheme } = useThemeSetting()

    useEffect(() => {
        if (fileContent.isLoaded) {
            sourceCode.current = fileContent.data;
        }
    }, [fileContent]);

    return (
        <AsyncView waitForLoading={1000} key={path} atom={fileContent}>
            <XStack mt={30} f={1} width={"100%"}>

                <SaveButton
                    path={path}
                    getContent={() => sourceCode.current}
                    positionStyle={{ right: 55, top: -33 }}
                />
                <Monaco
                    path={path}
                    darkMode={resolvedTheme == 'dark'}
                    sourceCode={fileContent.data}
                    onChange={(code) => { sourceCode.current = code; }}
                />
            </XStack>
        </AsyncView>
    );
}

export const processFilesIntent = ({ action, domain, data }: IntentType) => {
    const { mime } = data
    const type = mime ? mime.split('/')[0] : 'text'
    const url = ('/adminapi/v1/files/' + data.path).replace(/\/+/g, '/')
    if (mime == 'application/json') {
        return { component: <JSONViewer {...data} />, supportIcons: true }
    } else if (mime == 'application/javascript' || mime == 'video/mp2t') {
        return { component: <FlowsViewer {...data} />, supportIcons: true }
    } else if ((data.path).endsWith(".tsx")) {
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