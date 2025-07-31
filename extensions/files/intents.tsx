import { Spinner, XStack, YStack, useTheme, Button, Text, Input, TextArea } from '@my/ui'
import React, { useEffect, useRef, useCallback, useState, useContext, useMemo } from 'react';
import { useSearchParams, usePathname } from 'solito/navigation';
import { DataCard } from 'protolib/components/DataCard'
import AsyncView from 'protolib/components/AsyncView'
import { useFileFromAPI } from 'protolib/lib/useFileFromAPI'
import { IconContainer } from 'protolib/components/IconContainer'
import { Save, Workflow, Code, Ban, Check, X, Sparkles } from '@tamagui/lucide-icons';
import { useThemeSetting } from '@tamagui/next-theme'
// import GLTFViewer from 'protolib/adminpanel/features/components/ModelViewer'
import { Monaco } from 'protolib/components/Monaco'
import { IntentType } from 'protolib/lib/Intent'
import Center from 'protolib/components/Center'
import dynamic from 'next/dynamic'
import { API } from 'protobase';
import { usePrompt, promptCmd } from 'protolib/context/PromptAtom';
import { useInterval, useUpdateEffect } from 'usehooks-ts';
import Flows from 'protolib/adminpanel/features/components/Flows';
import { getDefinition, toSourceFile } from 'protonode/dist/lib/code'
import { ArrowFunction } from 'ts-morph';
import parserTypeScript from "prettier/parser-typescript.js";
import prettier from "prettier/standalone.js";
import { useEventEffect } from '@extensions/events/hooks'
import { useTint } from 'protolib/lib/Tints'
import { AppConfContext, SiteConfigType } from 'protolib/providers/AppConf';
import { Tinted } from 'protolib/components/Tinted';
import { useToastController } from '@my/ui';
import { getFlowsCustomSnippets } from "app/bundles/snippets"
import { getFlowsMenuConfig } from "app/bundles/flows"
import { getFlowMasks, getFlowsCustomComponents } from "app/bundles/masks"
import { Rules } from 'protolib/components/autopilot/Rules'

const GLTFViewer = dynamic(() => import('protolib/adminpanel/features/components/ModelViewer'), {
  loading: () => <Center>
    <Spinner size={'large'} scale={3} top={-50} />
    Loading
  </Center>,
  ssr: false
})

const onGenerateSnippset = async (name, code, cb, onError) => {
  if (!code || !name) {
    onError("")
    return
  };
  const res = await API.post("/api/v1/flow/snippet", { name, code });
  if (res?.error) {
    onError(res?.error?.error)
    return
  }
  cb()
}

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

type SaveButtonStates = "available" | "unavailable" | "loading" | "error"

const SaveButton = ({ checkStatus = () => true, defaultState = 'available', path, getContent, positionStyle, onSave = () => { } }) => {
  const [state, setState] = useState(defaultState)

  const onEvent = (event) => {
    setState(defaultState)
    onSave()
  }

  const onEventCrash = () => {
    setState("error")
  }

  useEventEffect(onEvent, { path: 'services/api-dev/start' })
  useEventEffect(onEventCrash, { path: 'services/api-dev/crash' })

  useInterval(() => {
    if (checkStatus() && state == 'unavailable') setState('available')
  }, 250)

  const _onSave = async () => {
    setState("loading")
    const content = getContent();
    await API.post('/api/core/v1/files/' + path.replace(/\/+/g, '/'), { content });
    if (!path.startsWith('/packages/app/apis/') && !path.startsWith('/data/automations/')) {
      setState(defaultState)
      onSave()
    }
  };

  return (
    <XStack position="absolute" {...positionStyle}>
      {<IconContainer disabled={state == 'unavailable'} onPress={_onSave}>
        {state != 'error' && state !== 'loading' && <Save color="var(--color)" size={"$1"} />}
        {state == 'error' && <Ban color="var(--red10)" size={"$1"} />}
        {/*@ts-ignore*/}
        {state == "loading" && <Spinner color={"$color"} opacity={0.5} size={17} />}
      </IconContainer>}
    </XStack>
  );
};

const FlowsViewer = ({ extraIcons, path, isModified, setIsModified, masksPath = undefined }) => {
  const [fileContent, setFileContent] = useFileFromAPI(path)
  const searchParams = useSearchParams();
  const query = Object.fromEntries(searchParams.entries());
  const sourceCode = useRef('')
  const isPartial = useRef(false)
  const [loaded, setLoaded] = useState(false)
  const originalSourceCode = useRef('')
  const defaultMode = useRef('code')
  useEffect(() => {
    if (fileContent.isLoaded) {
      if (fileContent.data.startsWith('//@flows')) {
        defaultMode.current = 'flow'
      }
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

  return <AsyncView ready={loaded}>
    <CodeView disableAIPanels={true} masksPath={masksPath} defaultMode={defaultMode.current} path={path} extraIcons={extraIcons} sourceCode={sourceCode} fileContent={fileContent} isModified={isModified} setIsModified={setIsModified}>
      <SaveButton
        onSave={() => originalSourceCode.current = sourceCode.current}
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
              plugins: [parserTypeScript],
              parser: "typescript"
            })
            if (code) {
              return code
            }
          }
          return sourceCode.current
        }}
        positionStyle={{ position: "relative" }}
      />
      {extraIcons}
    </CodeView>
  </AsyncView>
}

export const CodeView = ({ disableAIPanels = false, extraPanels = [], leftIcons = <></>, icons = <></>, disableFlowMode = false, masksPath = undefined, defaultMode = 'flow', monacoOnMount = (editor, monaco) => { }, monacoInstance = null, monacoOptions = {}, onCodeChange = (code) => { }, onFlowChange = (code) => { }, fileContent = null, path, rules = [], onApplyRules = async (rules) => { }, sourceCode, isModified = false, setIsModified = (x) => { }, query = {}, children = <></>, viewPort = undefined }) => {
  const pathname = usePathname();
  const theme = useTheme()
  const tint = useTint().tint
  const toast = useToastController();
  const { resolvedTheme } = useThemeSetting()
  const [mode, setMode] = useState(disableFlowMode ? 'code' : defaultMode)
  const [savedRules, setSavedRules] = useState(rules)

  console.log('sourceCode: ', sourceCode)
  const monaco = useMemo(() => {
    return monacoInstance ?? <Monaco
      key={Math.random()}
      path={path}
      onMount={(editor, monaco) => {
        monacoOnMount(editor, monaco)
      }}
      options={monacoOptions}
      darkMode={resolvedTheme == 'dark'}
      sourceCode={sourceCode.current}
      onChange={(code) => { onCodeChange(code); sourceCode.current = code }}
    />
  }, [sourceCode.current, path, resolvedTheme])

  const getBody = () => {
    const extraPanel = extraPanels.find(v => v.id == mode);
    if (extraPanel) {
      return extraPanel.content;
    }
    if (mode == 'rules') {
      return <YStack flex={1} height="100%" alignItems="center" justifyContent="center" boxShadow="0 0 10px rgba(0,0,0,0.1)" borderRadius="$3" p="$3" >
        <Rules
          rules={savedRules}
          onReloadRules={async (rules) => {
            setSavedRules(rules)
            await onApplyRules(rules)
          }}
          onAddRule={async (e, rule) => {
            const newRules = [...(savedRules ?? []), rule]
            setSavedRules(newRules)
            await onApplyRules(newRules)
          }}
          onDeleteRule={async (index) => {
            setSavedRules(savedRules.filter((_, i) => i != index))
            await onApplyRules(savedRules.filter((_, i) => i != index))
          }}
          onEditRule={async (index, rule) => {
            const newRules = [...savedRules]
            newRules[index] = rule
            setSavedRules(newRules)
          }}
          loadingIndex={-1}
        />
        <YStack mt="auto" pt="$3">

        </YStack>
      </YStack>
    }
    if (mode == 'code') return monaco
    if (mode == 'flow') return <Flows
      nodeMenu={({ nodeId, dumpFragment, closeMenu, updateFragment }) => {
        const [snippetName, setSnippetName] = useState();
        const [fragmentText, setFragmentText] = useState(dumpFragment());
        return (
          <YStack w={350} bg="$backgroundStrong" br="$6" p="$4" gap="$4" style={{ boxShadow: '0px 0px 33px 0px rgba(0, 0, 0, 0.1)' }} onPress={(e) => e.stopPropagation()}>
            <XStack f={1} jc="space-between" ai="center">
              <Tinted>
                <Text color={"$color7"} fontWeight={"500"}>Edit from code</Text>
              </Tinted>
              <XStack gap="$2">
                <Button
                  backgroundColor={"transparent"}
                  hoverStyle={{
                    backgroundColor: "$color2",
                    borderColor: "$color8"
                  }}
                  color="$color8"
                  borderColor="$color8"
                  size="$3"
                  onPress={() => closeMenu()}
                >
                  <X size={16} />
                </Button>
                <Tinted>
                  <Button disabled={!fragmentText} size="$3" onPress={() => { updateFragment(fragmentText); closeMenu() }}>
                    <Check size={16} fillOpacity={0} />
                  </Button>
                </Tinted>
              </XStack>
            </XStack>
            <YStack height={300}>
              <Monaco
                path={path}
                darkMode={resolvedTheme == 'dark'}
                sourceCode={fragmentText}
                options={{
                  folding: false,
                  lineDecorationsWidth: 0,
                  lineNumbersMinChars: 0,
                  lineNumbers: false,
                  minimap: { enabled: false }
                }}
                onChange={(code) => { setFragmentText(code); }}
              />
            </YStack>
            <XStack gap="$2">
              <Input f={1} value={snippetName} size="$3" placeholder='Snippet name required to export...' onChange={(e) => {
                // Only accepts alphabetical characters
                const regex = /^[a-zA-Z]+$/;
                // @ts-ignore 
                const value = e.target?.value
                if (regex.test(value) || value == '') {
                  setSnippetName(value);
                }
              }} />
              <Tinted>
                <Button
                  disabled={!snippetName}
                  size="$3"
                  color={!snippetName ? "$gray8" : "$color7"}
                  backgroundColor={"transparent"}
                  disabledStyle={{
                    borderColor: "$gray8",
                  }}
                  hoverStyle={{
                    backgroundColor: "$color2",
                    borderColor: "$color7"
                  }}
                  borderColor="$color7"
                  onPress={() => {
                    onGenerateSnippset(snippetName, fragmentText, closeMenu, (err = "") => {
                      toast.show("Error generating snippet", { message: err, duration: 3000 })
                    });
                  }}
                >
                  Export
                </Button>
              </Tinted>
            </XStack>
          </YStack>
        )
      }}
      config={{ menu: getFlowsMenuConfig(pathname, query) }}
      isModified={isModified}
      rawCodeFromMenu={true}
      customComponents={getFlowsCustomComponents(masksPath ? masksPath : pathname, query)}
      customSnippets={getFlowsCustomSnippets(pathname, query)}
      onEdit={(code) => { onFlowChange(code); sourceCode.current = code }}
      setIsModified={setIsModified}
      defaultViewPort={viewPort}
      setSourceCode={(sourceCode) => {
        sourceCode.current = sourceCode
      }}
      sourceCode={sourceCode.current}
      path={path}
      themeMode={resolvedTheme}
      primaryColor={resolvedTheme == 'dark' ? theme[tint + '8'].val : theme[tint + '7'].val} />
  }

  const content = <XStack mt={20} f={1} width={"100%"}>
    {/* <Theme name={tint as any}> */}
    <XStack position="absolute" left={20} top={-30}>
      {leftIcons}
    </XStack>
    <XStack position="absolute" right={20} top={-30}>
      {extraPanels.map(v => {
        const LICon = v.icon;
        return <IconContainer selected={mode == v.id} key={v.id} onPress={() => setMode(v.id)}>
          <LICon color="var(--color)" size={"$1"} />
        </IconContainer>
      })}
      {!disableAIPanels && <IconContainer selected={mode == 'rules'} onPress={() => setMode('rules')}>
        {/* <SizableText mr={"$2"}>Save</SizableText> */}
        <Sparkles color="var(--color)" size={"$1"} />
      </IconContainer>}
      {!disableFlowMode && <IconContainer selected={mode == 'flow'} onPress={() => setMode('flow')}>
        {/* <SizableText mr={"$2"}>Save</SizableText> */}
        <Workflow color="var(--color)" size={"$1"} />
      </IconContainer>}
      <IconContainer selected={mode == 'code'} onPress={() => setMode('code')}>
        {/* <SizableText mr={"$2"}>Save</SizableText> */}
        <Code color="var(--color)" size={"$1"} />
      </IconContainer>
      {icons}
      {children}
    </XStack>
    {getBody()}
    <XStack opacity={0} top={-200000} position={"absolute"}>
      <Flows preload={true} primary={"#f00"} />
    </XStack>
    {/* </Theme> */}
  </XStack>

  return fileContent ? <AsyncView atom={fileContent}>
    {content}
  </AsyncView> : content
}

const MonacoViewer = ({ path }) => {
  const [fileContent] = useFileFromAPI(path);
  const sourceCode = useRef('');
  const { resolvedTheme } = useThemeSetting();

  useEffect(() => {
    if (fileContent.isLoaded) {
      sourceCode.current = fileContent.data;
    }
  }, [fileContent]);

  const handleChange = useCallback((code) => {
    sourceCode.current = code;
  }, []);

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
          darkMode={resolvedTheme === 'dark'}
          sourceCode={fileContent.data}
          onChange={handleChange}
        />
      </XStack>
    </AsyncView>
  );
};
export const processFilesIntent = ({ action, domain, data }: IntentType) => {
  const { mime } = data
  const type = mime ? mime.split('/')[0] : 'text'
  const url = ('/api/core/v1/files/' + data.path).replace(/\/+/g, '/')
  if (mime == 'application/json') {
    return { component: <JSONViewer {...data} />, supportIcons: true }
  } else if (mime == 'application/javascript' || mime == 'video/mp2t') {
    return { component: <FlowsViewer {...data} />, supportIcons: true }
  } else if ((data.path).endsWith(".tsx")) {
    return {
      component: <MonacoViewer path={data.path} />,
      widget: 'text'
    }
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
  } else if (type == 'video') {
    return { component: <video src={url} controls />, widget: 'video' }
  } else if (type == 'audio') {
    return { component: <audio src={url} controls />, widget: 'audio' }
  }
}