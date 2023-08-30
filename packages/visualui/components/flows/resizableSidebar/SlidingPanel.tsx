
import React, { memo, useRef, useEffect } from "react";
import { NativeBaseProvider } from "native-base";
import currentTheme from "internalapp/themes/currentTheme";
import { PanelGroup, Panel, ImperativePanelHandle, PanelResizeHandle } from "react-resizable-panels";
import ResizeHandle from "./ResizeHandle";
import { withTopics } from "react-topics";

type Props = {
    rightPanelContent: React.Component,
    leftPanelContent: React.Component,
    centerPanelContent: React.Component,
    topics: any
};

const SlidingPanel = ({ rightPanelContent, leftPanelContent, centerPanelContent, topics }: Props) => {

    const leftPanel = useRef<ImperativePanelHandle>(null);
    const rightPanel = useRef<ImperativePanelHandle>(null);
    
    const { data } = topics;

    const [isFlowExpanded, setIsFlowExpanded] = React.useState(false)
    
    var expandedWidth = 50
    var collapsedWidth = (335 / window.innerWidth)* 100

    const onClick = () => {
        if (rightPanel?.current?.getSize() >= expandedWidth) {
            rightPanel.current?.resize(collapsedWidth)
            setIsFlowExpanded(false)
        } else {
            rightPanel.current?.resize(expandedWidth)
            setIsFlowExpanded(true)
        }
    }
    
    useEffect(() => {
        if(!data['menuState']) return
        const menuState = data['menuState'].state
        if (menuState == 'open' && rightPanel?.current?.getSize() < expandedWidth) {
          onClick()
        }
    }, [data['menuState']])
    useEffect(() => {
        if(!isFlowExpanded && rightPanel?.current?.getSize() > collapsedWidth){
            rightPanel.current?.resize(collapsedWidth)
        }
    }, [rightPanel?.current?.getSize()])

    return (
        // <NativeBaseProvider theme={currentTheme}>
            <div style={{ flex: 1, display: 'flex' }}>
                <PanelGroup autoSaveId="example" direction="horizontal" style={{ flex: 1, display: 'flex' }}>
                    <Panel
                        ref={leftPanel}
                        style={{ flex: 1, display: 'flex' }}
                        collapsible={false}
                        minSize={20}
                        order={1}
                    >
                        {!isFlowExpanded ? leftPanelContent : null}
                        {centerPanelContent}
                    </Panel>
                    {rightPanelContent ?
                        <>
                            <ResizeHandle disabled direction={!isFlowExpanded ? "LEFT" : "RIGHT"} onClick={onClick} />
                            <Panel
                                ref={rightPanel}
                                style={{ flex: 1, display: 'flex' }}
                                collapsible={true}
                                order={2}
                                minSize={25}
                            >
                                {rightPanelContent}
                            </Panel>
                        </> : null}
                </PanelGroup>
            </div>
        // </NativeBaseProvider>
    );
}

export default memo(withTopics(SlidingPanel, {topics: ['menuState'] }));