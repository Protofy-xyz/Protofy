import { FlowFactory, useFlowsStore } from 'protoflow';
export const UIFLOWID = "flows-editor"
import { TopicsProvider } from "react-topics";
import {getTokenValue} from '@tamagui/core'
import { Stack, useTheme } from '@my/ui';
const Flow = FlowFactory(UIFLOWID)
const uiStore = useFlowsStore()

const FlowsWidget = (props: any) => {
    const theme = useTheme()
    console.log('token: ', theme.borderColor.val)
    const bgColor = props.themeMode == 'dark'? '#000000' : '#FFFFFF'
    const foreColor = props.themeMode == 'light'? '#888888' : '#DDDDDD'
    const themeOverride = {
        edgeColor: theme.color9.val, //color of graph edges, the lines between the nodes
        nodeBackgroundColor: bgColor,
        inputBackgroundColor: bgColor,
        highlightInputBackgroundColor: theme.placeholderColor.val,
        inputBorder: '1px solid '+theme.shadowColor.val, //theme.red10.val,
        textColor: theme.color11.val,
        interactiveColor: theme.blue8.val,
        interactiveHoverColor: theme.blue3.val,
        borderColor: foreColor,
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
        <Stack  backgroundColor={'$borderColor'}/>
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
                //   if(vscode){
                //     currentContent.current = content
                //     if (vscode) vscode.setState({ text: content, config: config, viewport: viewPortRef.current});
                //     console.log('to vscode: ', content)
                //     vscode.postMessage({
                //       type: 'contentChange',
                //       text: content
                //     });
                //   }
            }}
            disableMiniMap={true}
            showActionsBar={false}
            bridgeNode={true}
        />
    </TopicsProvider>
}

export default FlowsWidget