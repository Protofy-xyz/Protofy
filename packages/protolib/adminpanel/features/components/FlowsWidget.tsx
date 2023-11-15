import { FlowFactory } from 'protoflow';
import { TopicsProvider } from "react-topics";
import { useState } from 'react';
import customMasks from '../../../../app/bundles/masks';

console.log("CUUUUUUSTOMMMM MASKS: ", customMasks)

const UIFLOWID = "flows-editor"
const Flow = FlowFactory(UIFLOWID)

const FlowsWidget = (props: any) => {
    const [content, setContent] = useState(props.content)
    // console.log("PROPS.MODE: ",props.mode, props.mode?props.mode:props.path?.endsWith('.json') ? 'json' : (props.path?.endsWith('yml') || props.path?.endsWith('yaml') ? 'yaml' : 'js'))

    return <TopicsProvider>
        
        {props.isModified ? props.icons:null}
        <Flow
            path={props.path}
            // onViewPortChange={(viewPort) => {
            //   viewPortRef.current = viewPort;
            //   if (vscode) vscode.setState({ text: initialState, config: initialConfig, viewport: viewPortRef.current })
            // }}
            // defaultViewPort={viewPortRef.current}
            key={'flow'}
            mode={props.mode?props.mode:props.path.endsWith('.json') ? 'json' : (props.path.endsWith('yml') || props.path.endsWith('yaml') ? 'yaml' : 'js')}
            config={{ masks: [], layers: [] }}
            bgColor={props.bgColor??'transparent'}
            dataNotify={(data: any) => {
                if (data.notifyId) {
                    //mqttPub('datanotify/' + data.notifyId, JSON.stringify(data))
                }
            }}
            themeMode={props.themeMode}
            disableDots={props.disableDots??false}
            customComponents={customMasks}
            sourceCode={props.sourceCode}
            setSourceCode={props.setSourceCode}
            positions={[]}
            getFirstNode={props.getFirstNode}
            onSave={props.onSave}
            onPlay={props.onPlay}
            hideBaseComponents={props.hideBaseComponents??false}
            disableSideBar={true}
            disableStart={props.disableStart??false}
            onShowCode={props.onShowCode}
            onReload={props.onReload}
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
            showActionsBar={props.showActionsBar??false}
            bridgeNode={props.bridgeNode??true}
        />
    </TopicsProvider>
}

export default FlowsWidget