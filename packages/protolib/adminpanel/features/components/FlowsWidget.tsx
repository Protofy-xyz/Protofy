import { FlowFactory, useFlowsStore } from 'protoflow';
import { TopicsProvider } from "react-topics";
import { useTheme } from '@my/ui';
import { useState } from 'react';

const UIFLOWID = "flows-editor"
const Flow = FlowFactory(UIFLOWID)
const uiStore = useFlowsStore()

const FlowsWidget = (props: any) => {
    const [content, setContent] = useState(props.content)
    const [originalContent, setOriginalContent] = useState(props.content)
    const theme = useTheme()
    console.log('token: ', theme.borderColor.val)


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