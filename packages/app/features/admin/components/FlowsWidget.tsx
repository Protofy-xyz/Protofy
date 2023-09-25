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
    const themeOverride = {
        edgeColor: theme.borderColor.val,
        nodeBackgroundColor: theme.backgroundFocus.val,
        inputBackgroundColor: theme.placeholderColor,
        highlightInputBackgroundColor: theme.placeholderColor,
        inputBorder: theme.borderColor.val,
        textColor: theme.color.val,
        interactiveColor: theme.backgroundPress.val,
        interactiveHoverColor: theme.backgroundHover.val,
        borderColor: theme.borderColorHover.val,
        handleBorderColor: theme.borderColor.val,
        flowOutputColor: theme.color1.val,
        dataOutputColor: theme.color1.val,
        colorError: theme.red8.val,
        blockPort: theme.color.val, //vsCodeTheme['--vscode-terminal-ansiBlack'],
        flowPort: theme.color.val, //vsCodeTheme['--vscode-terminal-ansiBrightBlack'],
        dataPort: theme.color.val, //vsCodeTheme['--vscode-terminal-ansiWhite'],
        nodeBorderColor: theme.borderColor.val
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