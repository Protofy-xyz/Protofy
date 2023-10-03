
import React, { memo, useRef, useEffect } from "react";
import { withTopics } from "react-topics";
import SPanel from 'react-sliding-side-panel';
import 'react-sliding-side-panel/lib/index.css';
import { Component, Workflow, Save } from 'lucide-react';
import FloatingPanel from "./FloatingPanel";
import './floatingBar.css';

type Props = {
    rightPanelContent: React.Component | any,
    leftPanelContent: React.Component | any,
    centerPanelContent: React.Component | any,
    topics: any
};

const MainPanel = ({ rightPanelContent, leftPanelContent, centerPanelContent, topics }: Props) => {

    const [openPanel, setOpenPanel] = React.useState(false);
    const [selectedId, setSelectedId] = React.useState();
    const { publish, data } = topics;
    
    const compressedSize = 50

    const [visibleFlows, setVisibleFlows] = React.useState(false);
    const [size, setSize] = React.useState({ x: compressedSize, y: compressedSize });
    const [previewState, setPreviewState] = React.useState({ size: { x: 400, y: 400 }, position: { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 } });

    const onShowFlows = () => {
        const newState = !visibleFlows
        setVisibleFlows(newState)
        if (newState) { // visible
            setSize(previewState.size)
        } else {
            setPreviewState(s => { return ({ ...s, size: size }) })
            setSize({ x: compressedSize, y: compressedSize })
        }
    }

    useEffect(() => {
        if (data['zoomToNode']?.id != selectedId && !visibleFlows) {
            setSelectedId(data['zoomToNode'].id)
            setVisibleFlows(true)
            setSize(previewState.size)
        }
    }, [data['zoomToNode']])

    useEffect(() => {
        window.addEventListener('dragenter', () => setOpenPanel(false))
    })

    return (
        <div style={{ flex: 1, display: 'flex' }}>
            <div style={{ flex: 1, display: openPanel ? 'flex' : 'none', position: 'absolute' }} onClick={() => setOpenPanel(false)} >
                <SPanel
                    key="sidebar"
                    type={'left'}
                    isOpen={true}
                    size={30}
                >
                    {leftPanelContent}
                </SPanel>
            </div>
            <div
                style={{ display: 'flex', position: 'fixed', flexDirection: 'column', alignSelf: 'center', left: '20px', zIndex: 10000 }}
            >
                <div
                    className="floatingIcon"
                    style={{ marginBottom: 20 }}
                >
                    <Component
                        onClick={() => setOpenPanel(true)}
                        color="white"
                    />
                </div>
                <div
                    className="floatingIcon"
                    style={{ marginBottom: 20 }}
                >
                    <Save
                        onClick={() => publish("savenodes", {})}
                        color="white"
                    />
                </div>
                <div
                    onClick={() => onShowFlows()}
                    className="floatingIcon"
                >
                    <Workflow color="white" style={{ cursor: 'grab' }} />
                </div>
            </div>
            <div style={{ position: 'absolute', zIndex: 1000, width: '0px' }}>
                <FloatingPanel
                    visibleFlows={visibleFlows}
                    size={size}
                    setSize={setSize}
                    previewState={previewState}
                    setPreviewState={setPreviewState}
                    onShowToggle={onShowFlows}
                >
                    {rightPanelContent}
                </FloatingPanel>
            </div>
            {centerPanelContent}
        </div>
    );
}



export default memo(withTopics(MainPanel, { topics: ["zoomToNode"] }));