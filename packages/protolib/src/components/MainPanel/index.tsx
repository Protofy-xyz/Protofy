
import React, { memo, useEffect, useRef } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import SPanel from 'react-sliding-side-panel';
import { useWindowSize } from 'usehooks-ts'

type Props = {
    actionContent?: React.Component | any,
    rightPanelContent: React.Component | any,
    leftPanelContent?: React.Component | any,
    centerPanelContent: React.Component | any,
    height?: React.Component | any,
    rightPanelResizable?: boolean,
    rightPanelVisible?: boolean,
    openPanel?: boolean,
    setOpenPanel?: any,
    rightPanelWidth?:number,
    rightPanelStyle?:any,
    rightPanelSize?:number,
    setRightPanelSize?:any,
    borderLess?:boolean
};

export const MainPanel = ({ borderLess, rightPanelSize,setRightPanelSize,rightPanelStyle={}, rightPanelWidth=0, actionContent, rightPanelContent, leftPanelContent, centerPanelContent, rightPanelResizable = false, rightPanelVisible = true, openPanel, setOpenPanel=()=>{}, height = "100vh"}: Props) => {
    const rightRef = useRef<any>()
    const resizerRef = useRef<any>();
    const resizerBarRef = useRef<any>()
    const hoverTimer = useRef(null);
    const size = useWindowSize()
    
    const getLeftWidth = () => {
        const totalWidth = Math.max(400, size.width)
        let percentage = (350 / totalWidth) * 100;
        return percentage;
    }
    const getRightWidth = () => {
        if(rightPanelSize) return rightPanelSize
        const totalWidth = Math.max(400, size.width)
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
            // resizerRef.current.style.width = '20px'
            // resizerRef.current.style.borderRight = '1px solid #cccccc20'
        }
        if (resizerBarRef.current) resizerBarRef.current.style.display = 'flex'
    }
    const onHoverLeave = () => {
        clearTimeout(hoverTimer.current);
        if (resizerRef.current) {
            if (resizerRef.current.isDragging) return
            // resizerRef.current.style.width = '4px'
            // resizerRef.current.style.borderRight = '0px'
        }
        if (resizerBarRef.current) resizerBarRef.current.style.display = 'none'
    }

    useEffect(() => {
        if (rightRef.current) {
            rightRef.current.resize(rightPanelWidth ? rightPanelWidth : getRightWidth(), "percentages")
        }
    }, [rightPanelResizable])

    return (
        <div style={{ flex: 1, display: 'flex', maxWidth: '100%' }}>
            {leftPanelContent && <div id="sidebar-panel-container" style={{ flex: 1, display: openPanel ? 'flex' : 'none', position: 'absolute', width: getLeftWidth(), zIndex: 99999999 }}>
                <SPanel
                    key="sidebar"
                    type={'left'}
                    isOpen={true}
                    size={getLeftWidth()}
                    backdropClicked={() => setOpenPanel(false)}
                >
                    {leftPanelContent}
                </SPanel>
            </div>}
            {actionContent && <div
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
            </div>}
            <PanelGroup direction="horizontal" style={{ height: '100%', display: 'flex' }}>
                <Panel>
                    <div style={{ display: 'flex', flex: 1, height: height }}>
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
                            backgroundColor: borderLess?'transparent':'#252526',
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
                    onResize={(size) => setRightPanelSize ? setRightPanelSize(size):null}
                    ref={rightRef}
                    maxSize={80} defaultSize={rightPanelWidth ? rightPanelWidth : getRightWidth()}
                    style={{
                        // fix first render problem with zoomToNode, can't do it with display: "flex"<->"none"
                        position: rightPanelVisible ? "relative" : "absolute",
                        zIndex: rightPanelVisible ? 100000 : -10,
                        display: 'flex',
                        ...rightPanelStyle
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