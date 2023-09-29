
import React, { memo, useRef, useEffect } from "react";
import { withTopics } from "react-topics";
import SPanel from 'react-sliding-side-panel';
import 'react-sliding-side-panel/lib/index.css';
import { Component } from 'lucide-react';
import FloatingPanel from "./FloatingPanel";

type Props = {
    rightPanelContent: React.Component | any,
    leftPanelContent: React.Component | any,
    centerPanelContent: React.Component | any,
    topics: any
};

const SlidingPanel = ({ rightPanelContent, leftPanelContent, centerPanelContent, topics }: Props) => {

    const rightPanel = useRef(null);
    const [acollapsedWidth, setCollapsedWidth] = React.useState(0);
    const collapsedWidth = 0;
    // const { data } = topics;
    const [openPanel, setOpenPanel] = React.useState(false);

    const [isFlowExpanded, setIsFlowExpanded] = React.useState(false)

    var expandedWidth = 50

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
        setCollapsedWidth((335 / window.innerWidth) * 100)
    }, [])

    // useEffect(() => {
    //     if(!data['menuState']) return
    //     const menuState = data['menuState'].state
    //     if (menuState == 'open' && rightPanel?.current?.getSize() < expandedWidth) {
    //       onClick()
    //     }
    // }, [data['menuState']])

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
                // noBackdrop={true}
                >
                    {leftPanelContent}
                </SPanel>
            </div>
            <div
                style={{ display: 'flex', position: 'fixed', alignSelf: 'center', left: '20px', backgroundColor: 'black', zIndex: 10000, cursor: 'pointer', padding: '10px', alignItems: 'center', borderRadius: '40px' }}
            >
                <Component
                    onClick={() => setOpenPanel(true)}
                    color="white"
                />
            </div>
            <div style={{ position: 'absolute', zIndex: 1000, border: "1px solid red", width: '0px', height: '0px' }}>
                <FloatingPanel>
                    {rightPanelContent}
                </FloatingPanel>
            </div>
            {centerPanelContent}
        </div>
    );
}



export default memo(withTopics(SlidingPanel, { topics: ['menuState'] }));