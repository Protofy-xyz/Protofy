import { FlowFactory } from 'protoflow';
import { TopicsProvider } from "react-topics";
import { useState } from 'react';

const UIFLOWID = "flows-editor"
const Flow = FlowFactory(UIFLOWID)

const FlowsWidget = (props: any) => {
    const [content, setContent] = useState(props.content)

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
            // store={uiStore}
            display={true}
            flowId={"flows-editor"}
            onEdit={(content) => {
                if(props.setIsModified) props.setIsModified(true)
                setContent(content)
                if(props.onEdit) {
                    props.onEdit(content)
                }
            }}
            theme={props.theme ?? {}}
            disableMiniMap={true}
            showActionsBar={false}
            bridgeNode={true}
        />
    </TopicsProvider>
}

export default FlowsWidget