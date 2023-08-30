
import React, { memo, useRef } from "react";
import { NativeBaseProvider } from "native-base";
import currentTheme from "internalapp/themes/currentTheme";
import { PanelGroup, Panel, ImperativePanelHandle } from "react-resizable-panels";
import ResizeHandle from "./ResizeHandle";

type Props = {
    BackgroundElement: React.Component,
    rightPanelContent: React.Component,
    leftPanelContent: React.Component,
    isLeftDisabled: boolean,
};

const FlowsSlidingPanel = ({ BackgroundElement, rightPanelContent, leftPanelContent, isLeftDisabled }: Props) => {
    const leftPanel = useRef<ImperativePanelHandle>(null);
    const rightPanel = useRef<ImperativePanelHandle>(null);

    if (isLeftDisabled) {
        leftPanel?.current?.collapse()
    }
    
    return (
        <NativeBaseProvider theme={currentTheme}>
            <div style={{ width: '100%', height: '100%', display: 'flex', position: 'absolute', zIndex: 1 }}>
                {BackgroundElement}
            </div>
            <div style={{ flex: 1, height: '100%', width: '100%', zIndex: 2, pointerEvents: 'none' }}>
                <PanelGroup autoSaveId="example" direction="horizontal" style={{ zIndex: 2, pointerEvents: 'none' }}>
                    <Panel
                        ref={leftPanel}
                        style={{ flex: 1, pointerEvents: 'all' }}
                        collapsible={true}
                        defaultSize={0}
                        order={1}
                    >
                        {!isLeftDisabled ? leftPanelContent : null}
                        {/* <div onClick={() => console.log('left')} style={{ height: "100%", width: "100%", overflow: "hidden", display: "flex", background: 'red' }}>left</div> */}
                    </Panel>
                    <ResizeHandle
                        onTogglePanel={() => {
                            if (leftPanel.current?.getCollapsed()) {
                                leftPanel.current?.expand();
                                leftPanel.current?.resize(40)
                            } else {
                                leftPanel.current?.collapse()
                            }
                        }}
                        disabled={isLeftDisabled}
                        direction="LEFT"
                    />
                    <Panel collapsible={false} order={2} style={{ pointerEvents: 'none' }}>
                        <div style={{ height: "100%", width: "100%", overflow: "hidden", display: "flex", background: 'transparent', pointerEvents: 'none' }}></div>
                    </Panel>
                    <ResizeHandle
                        onTogglePanel={() => {
                            if (rightPanel.current?.getCollapsed()) {
                                rightPanel.current?.expand();
                                rightPanel.current?.resize(25)
                            } else {
                                rightPanel.current?.collapse()
                            }
                        }}
                        direction="RIGHT"
                    />
                    <Panel
                        ref={rightPanel}
                        style={{ flex: 1, pointerEvents: 'all' }}
                        collapsible={true}
                        defaultSize={0}
                        order={3}
                    >
                        {rightPanelContent}
                        {/* <div onClick={() => console.log('right')} style={{ height: "100%", width: "100%", overflow: "hidden", display: "flex", background: 'yellow' }}>right</div> */}
                    </Panel>
                </PanelGroup>
            </div>
        </NativeBaseProvider>
    );
}

export default memo(FlowsSlidingPanel);



