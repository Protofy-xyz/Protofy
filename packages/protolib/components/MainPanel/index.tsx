
import React, { memo, useEffect, useRef } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Component, Save, X } from 'lucide-react';
import { useRouter } from "next/router"
import SPanel from 'react-sliding-side-panel';

type Props = {
    actionContent?: React.Component | any,
    rightPanelContent: React.Component | any,
    leftPanelContent: React.Component | any,
    centerPanelContent: React.Component | any,
    rightPanelResizable?: boolean,
    rightPanelVisible?: boolean,
    openPanel?: boolean,
    setOpenPanel?: any
};

const MainPanel = ({ actionContent, rightPanelContent, leftPanelContent, centerPanelContent, rightPanelResizable = false, rightPanelVisible = true, openPanel, setOpenPanel=()=>{}}: Props) => {
    const rightRef = useRef()
    const resizerRef = useRef()
    const resizerBarRef = useRef()
    const hoverTimer = useRef(null);

    const getLeftWidth = () => {
        const totalWidth = window.innerWidth
        let percentage = (300 / totalWidth) * 100;
        return percentage;
    }
    const getRightWidth = () => {
        const totalWidth = window.innerWidth
        let percentage = (400 / totalWidth) * 100;
        return percentage;
    }

    const handleMouseEnter = () => {
        hoverTimer.current = setTimeout(() => {
            onHover()
        }, 50)
    };
    const onHover = () => {
        if (resizerRef.current) {
            resizerRef.current.style.width = '20px'
            resizerRef.current.style.borderRight = '1px solid #cccccc20'
        }
        if (resizerBarRef.current) resizerBarRef.current.style.display = 'flex'
    }
    const onHoverLeave = () => {
        clearTimeout(hoverTimer.current);
        if (resizerRef.current) {
            if (resizerRef.current.isDragging) return
            resizerRef.current.style.width = '4px'
            resizerRef.current.style.borderRight = '0px'
        }
        if (resizerBarRef.current) resizerBarRef.current.style.display = 'none'
    }

    useEffect(() => {
        if (rightRef.current) {
            rightRef.current.resize(rightPanelResizable ? 50 : getRightWidth(), "percentages")
        }
    }, [rightPanelResizable])

    return (
        <div style={{ flex: 1, display: 'flex' }}>
            <div id="sidebar-panel-container" style={{ flex: 1, display: openPanel ? 'flex' : 'none', position: 'absolute', width: getLeftWidth(), zIndex: 99999999 }}>
                <SPanel
                    key="sidebar"
                    type={'left'}
                    isOpen={true}
                    size={getLeftWidth()}
                    backdropClicked={() => setOpenPanel(false)}
                >
                    {leftPanelContent}
                </SPanel>
            </div>
            <div
                id="left-actions-container"
                style={{
                    display: openPanel ? "none" : "flex",
                    position: 'fixed',
                    zIndex: 99999999999999999999,
                    flexDirection: 'column',
                    left: '20px',
                    top: 'calc(50vh - 80px)'
                }}
            >
                {actionContent}
            </div>
            <PanelGroup direction="horizontal" style={{ height: '100%', display: 'flex' }}>
                <Panel>
                    <div style={{ display: 'flex', flex: 1, height: '100vh' }}>
                        {centerPanelContent}
                    </div>
                </Panel>
                <PanelResizeHandle
                    onDragging={(isDragging) => {
                        if (resizerRef.current) resizerRef.current.isDragging = isDragging
                        if (!isDragging) onHoverLeave()
                    }}
                >
                    <div
                        ref={resizerRef}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={onHoverLeave}
                        style={{
                            backgroundColor: '#252526',
                            display: rightPanelVisible && rightPanelResizable ? 'flex' : 'none',
                            width: '4px',
                            height: '100%',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <div ref={resizerBarRef} style={{ height: '60px', width: "4px", backgroundColor: 'white', borderRadius: '20px', display: 'none' }}>
                        </div>
                    </div>
                </PanelResizeHandle>
                <Panel
                    ref={rightRef} minSize={getRightWidth()}
                    maxSize={80} defaultSize={rightPanelResizable ? 50 : getRightWidth()}
                    style={{
                        // fix first render problem with zoomToNode, can't do it with display: "flex"<->"none"
                        position: rightPanelVisible ? "relative" : "absolute",
                        zIndex: rightPanelVisible ? 100000 : -10,
                        display: 'flex'
                    }}>
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', width: '100%' }}>
                        {rightPanelContent}
                    </div>
                </Panel>
            </PanelGroup>
        </div>
    );
}

export default memo(MainPanel);