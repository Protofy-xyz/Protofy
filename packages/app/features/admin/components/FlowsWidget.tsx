import { FlowFactory, useFlowsStore } from 'protoflow';
export const UIFLOWID = "flows-editor"
import { TopicsProvider } from "react-topics";
const Flow = FlowFactory(UIFLOWID)
const uiStore = useFlowsStore()

const FlowsWidget = (props:any) => {
    return <TopicsProvider>
        <Flow
            disableDots={false}
            sourceCode={"const a = 1"}
            setSourceCode={() => {}}
            customComponents={[]}
            onSave={(code, _, data) => {}}
            onShowCode={() => {}}
            enableCommunicationInterface={false}
            store={uiStore}
            // config={{masks: UIMasks}}
            flowId={UIFLOWID}
            {...props}
        />
    </TopicsProvider>
}

export default FlowsWidget