import { FlowFactory, useFlowsStore } from 'protoflow';
import {IconContainer} from 'protolib';
import { TopicsProvider } from "react-topics";
import {getTokenValue} from '@tamagui/core'
import { Paragraph, SizableText, Stack, XStack, useTheme } from '@my/ui';
import { Save, X } from '@tamagui/lucide-icons';
import { useEffect, useState } from 'react';

const UIFLOWID = "flows-editor"
const Flow = FlowFactory(UIFLOWID)
const uiStore = useFlowsStore()

const FlowsWidget = (props: any) => {
    const [content, setContent] = useState(props.content)
    const [originalContent, setOriginalContent] = useState(props.content)
    const theme = useTheme()
    console.log('token: ', theme.borderColor.val)
    const bgColor = props.themeMode == 'dark'? '#282828' : '#FFFFFF'
    const foreColor = props.themeMode == 'light'? '#888888' : '#888888'
    const themeOverride = {
        edgeColor: theme.color9.val, //color of graph edges, the lines between the nodes
        nodeBackgroundColor: bgColor,
        inputBackgroundColor: bgColor,
        highlightInputBackgroundColor: theme.placeholderColor.val,
        inputBorder: '1px solid '+theme.shadowColor.val, //theme.red10.val,
        textColor: props.themeMode == 'light' ? theme.color12.val : theme.color11.val,
        titleColor: props.themeMode == 'light'?theme.color12.val:theme.color8.val,
        interactiveColor: props.themeMode == 'light'? theme.blue8.val : theme.color11.val,
        interactiveHoverColor: props.themeMode == 'light'?theme.blue3.val:theme.color8.val,
        borderColor: props.themeMode == 'light'? theme.color11.val : theme.color7.val,
        handleBorderColor: theme.borderColor.val,
        flowOutputColor: theme.color5.val,
        dataOutputColor: theme.color5.val,
        colorError: theme.red8.val,
        blockPort: theme.color5.val, //vsCodeTheme['--vscode-terminal-ansiBlack'],
        flowPort: theme.color5.val, //vsCodeTheme['--vscode-terminal-ansiBrightBlack'],
        dataPort: theme.color5.val, //vsCodeTheme['--vscode-terminal-ansiWhite'],
        nodeBorderColor: foreColor, //border of the small connectors, the circles
    }

    return <TopicsProvider>
        {props.isModified ?props.icons:null}
        <Flow
            path={props.path}
            // onViewPortChange={(viewPort) => {
            //   viewPortRef.current = viewPort;
            //   if (vscode) vscode.setState({ text: initialState, config: initialConfig, viewport: viewPortRef.current })
            // }}
            // defaultViewPort={viewPortRef.current}
            key={'flow'}
            mode={props.path.endsWith('.json') ? 'json' : (props.path.endsWith('yml') || props.path.endsWith('yaml') ? 'yaml' : 'js')}
            config={{ masks: [], layers: [] }}
            bgColor='transparent'
            dataNotify={(data: any) => {
                if (data.notifyId) {
                    //mqttPub('datanotify/' + data.notifyId, JSON.stringify(data))
                }
            }}
            themeMode={props.themeMode}
            disableDots={false}
            customComponents={[]}
            sourceCode={props.sourceCode}
            setSourceCode={props.setSourceCode}
            positions={[]}
            onSave={() => {
                
            }}
            disableSideBar={true}
            onShowCode={() => { }}
            onReload={() => { }}
            store={uiStore}
            display={true}
            flowId={"flows-editor"}
            theme={themeOverride}
            onEdit={(content) => {
                if(props.setIsModified) props.setIsModified(true)
                setContent(content)
            }}
            disableMiniMap={true}
            showActionsBar={false}
            bridgeNode={true}
        />
    </TopicsProvider>
}

export default FlowsWidget