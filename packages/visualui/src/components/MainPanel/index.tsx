
import React, { memo, useRef, useEffect } from "react";
import { withTopics } from "react-topics";
import SPanel from 'react-sliding-side-panel';
import 'react-sliding-side-panel/lib/index.css';
import { Component, Workflow } from 'lucide-react';
import FloatingPanel from "./FloatingPanel";
import './floatingBar.css';

type Props = {
    rightPanelContent: React.Component | any,
    leftPanelContent: React.Component | any,
    centerPanelContent: React.Component | any,
    topics: any
};

const SlidingPanel = ({ rightPanelContent, leftPanelContent, centerPanelContent, topics }: Props) => {

    const rightPanel = useRef(null);
    const collapsedWidth = 0;
    const [openPanel, setOpenPanel] = React.useState(false);
    const [openPreview, setOpenPreview] = React.useState(false);
    const [isFlowExpanded, setIsFlowExpanded] = React.useState(false)


    useEffect(() => {
        if (!isFlowExpanded && rightPanel?.current?.getSize() > collapsedWidth) {
            rightPanel.current?.resize(collapsedWidth)
        }
    }, [rightPanel?.current?.getSize()])

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
                    <Component
                        onClick={() => alert('HELLL')}
                        color="red"
                    />
                </div>
                <div
                    onClick={() => setOpenPreview(!openPreview)}
                    className="floatingIcon"
                >
                    <Workflow color="white" style={{ cursor: 'grab' }} />
                </div>
            </div>
            <div style={{ position: 'absolute', zIndex: 1000, width: '0px' }}>
                <FloatingPanel showTrigger={openPreview}>
                    {rightPanelContent}
                </FloatingPanel>
            </div>
            {centerPanelContent}
        </div>
    );
}



export default memo(withTopics(SlidingPanel, { topics: ['menuState'] }));