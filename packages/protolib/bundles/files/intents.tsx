import { Spinner, XStack } from 'tamagui'
import { useRouter } from 'next/router'
import { DataCard } from '../../components/DataCard'
import AsyncView from '../../components/AsyncView'
import { useFileFromAPI } from '../../lib/useFileFromAPI'
import { IconContainer } from '../../components/IconContainer'
import { Save, Workflow, Code } from '@tamagui/lucide-icons';
import { useThemeSetting } from '@tamagui/next-theme'
// import GLTFViewer from '../../adminpanel/features/components/ModelViewer'
import { Monaco } from '../../components/Monaco'
import { IntentType } from '../../lib/Intent'
import Center from '../../components/Center'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react';
import { API } from '../../base/Api';
import { usePrompt, promptCmd } from '../../context/PromptAtom';
import { useInterval, useUpdateEffect } from 'usehooks-ts';
import Flows from '../../adminpanel/features/components/Flows';
import { getFlowsCustomComponents } from 'app/bundles/masks'
import { getDefinition, toSourceFile } from '../../api/lib/code'
import { ArrowFunction } from 'ts-morph';
import parserTypeScript from "prettier/parser-typescript.js";
import prettier from "prettier/standalone.js";

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
        itemCardProps={{ topBarProps: { top: -10, backgroundColor: 'transparent' } }}
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

type SaveButtonStates = "available" | "unavailable" | "loading"

const SaveButton = ({ checkStatus=() => true, defaultState='available', path, getContent, positionStyle, onSave=()=>{} }) => {
  const [state, setState] = useState(defaultState)

  useInterval(() => {
    if(checkStatus() && state == 'unavailable') setState('available')
  }, 250)

  const _onSave = async () => {
    setState("loading")
    const content = getContent();
    await API.post('/adminapi/v1/files/' + path.replace(/\/+/g, '/'), { content });
    setState(defaultState)
    onSave()
  };

  return (
    <XStack position="absolute" {...positionStyle}>
      {state != "loading" && <IconContainer disabled={state=='unavailable'} onPress={_onSave}>
        <Save color="var(--color)" size={"$1"} />
      </IconContainer>}
      {state == "loading" && <Spinner color={"$color"} opacity={0.5} size={17} />}
    </XStack>
  );
};

const FlowsViewer = ({ extraIcons, isFull, path, isModified, setIsModified }) => {
  const [fileContent, setFileContent] = useFileFromAPI(path)
  const [newFileContent, setNewFileContent] = useState('')
  const [loaded, setLoaded] = useState(false)
  const isPartial = useRef(false)
  const sourceCode = useRef('')
  const originalSourceCode = useRef('')
  const router = useRouter()

  const [promptResponse, setPromptResponse] = usePrompt(
    (prompt, total, image) => {
      const isGenerate = prompt.startsWith('/code')
      const prefix = `The user is viewing a sourceCode file named: ${path}. The content of the sourceFile is: ${sourceCode.current}`
      const suffix = isGenerate ? `
The user has generated a request to change the sourceCode content. You need to fulfill the request. Reply only with source code with prefix: [code] and nothing else. Your response will be used directly to replace the content of the sourceFile, but adaptaed to what the user requested.
For example, if the final code you decide to generate is "console.log('test');" then your anser should be [code]console.log('test');
Keep the original sourcecode comments when generating new code;
If you are unable to generate the source code (too ambiguous/unespecific/whaterver reason), explain why in natural language, but do not include [code] at the beginning.
Remember to generate a response for the request that is only sourceCode and prefixed with [code]. Your response will be used to feed another program, that expects just [code] and sourceCode.
If you include anything else in your message (like reasonings or natural language) it will be considered that you are rejecting the request, and the reasons will be shown to the user.
            `: ''
      return suffix + prefix
    },

    () => promptCmd({ cmd: '/code', format: "sourceCode", action: "generates a source code solution in source code format of the current file." }),
  )

  useUpdateEffect(() => {
    console.log('Response prompt: ', promptResponse)
    if (promptResponse.startsWith("[code]")) {
      console.log('Replacing code with updated code')
      const response = promptResponse.substring("[code]".length)
      setNewFileContent(response)
      sourceCode.current = response;
    }
  }, [promptResponse])

  useEffect(() => {
    if (fileContent.isLoaded) {
      const sourceFile = toSourceFile(fileContent.data)
      const definition = getDefinition(sourceFile, '"code"')
      if (definition && ArrowFunction.isArrowFunction(definition)) {
        sourceCode.current = definition.getBodyText()
        isPartial.current = true
      } else {
        isPartial.current = false
        sourceCode.current = fileContent.data
      }
      originalSourceCode.current = sourceCode.current
      setLoaded(true)
    }
  }, [fileContent]);

  const { resolvedTheme } = useThemeSetting()
  const [mode, setMode] = useState('flow')

  
  return <AsyncView atom={fileContent}>
    <XStack mt={30} f={1} width={"100%"}>
      {/* <Theme name={tint as any}> */}
      <XStack position="absolute" right={20} top={-32}>
        {mode == 'code' ? <IconContainer onPress={() => setMode('flow')}>
          {/* <SizableText mr={"$2"}>Save</SizableText> */}
          <Workflow color="var(--color)" size={"$1"} />
        </IconContainer> :
          <IconContainer onPress={() => setMode('code')}>
            {/* <SizableText mr={"$2"}>Save</SizableText> */}
            <Code color="var(--color)" size={"$1"} />
          </IconContainer>}
        <SaveButton
          onSave={()=>originalSourceCode.current = sourceCode.current}
          checkStatus={() => sourceCode.current != originalSourceCode.current}
          defaultState={"unavailable"}
          path={path}
          getContent={() => {
            if (isPartial.current) {
              const sourceFile = toSourceFile(fileContent.data)
              const definition = getDefinition(sourceFile, '"code"').getBody()
              definition.replaceWithText("{\n" + sourceCode.current + "\n}");
              const code = prettier.format(sourceFile.getFullText(), {
                quoteProps: "consistent",
                parser: "typescript",
                plugins: [parserTypeScript]
              })
              if(code) {
                return code
              }
            }
            return sourceCode.current
          }}
          positionStyle={{ position: "relative" }}
        />
        {extraIcons}
      </XStack>
      {mode == 'code' ? <Monaco path={path} darkMode={resolvedTheme == 'dark'} sourceCode={newFileContent ? newFileContent : sourceCode.current} onChange={(code) => { sourceCode.current = code }} /> : <Flows
        isModified={isModified}
        customComponents={getFlowsCustomComponents(router.pathname, router.query)}
        onEdit={(code) => { sourceCode.current = code }}
        setIsModified={setIsModified}
        setSourceCode={(sourceCode) => {
          sourceCode.current = sourceCode
        }} sourceCode={newFileContent ? newFileContent : sourceCode.current} path={path} themeMode={resolvedTheme} />}
      <XStack opacity={0} top={-200000} position={"absolute"}>
        <Flows preload={true} />
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