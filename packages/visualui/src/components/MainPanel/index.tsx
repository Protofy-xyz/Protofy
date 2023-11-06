
import React, { memo, useEffect } from "react";
import { withTopics } from "react-topics";
import { Panel, PanelGroup } from "react-resizable-panels";
import { Component, Workflow, Save, X, ChevronLeft } from 'lucide-react';
import { useRouter } from "next/router"
import SPanel from 'react-sliding-side-panel';

type Props = {
    rightPanelContent: React.Component | any,
    leftPanelContent: React.Component | any,
    centerPanelContent: React.Component | any,
    topics: any
};

const FloatingIcon = ({ children, onClick, disabled = false }) => <div onClick={disabled ? () => null : onClick} style={{ marginBottom: 20, backgroundColor: 'black', opacity: disabled ? 0.2 : 1, borderRadius: '100%', justifyContent: 'center', alignItems: 'center', width: '40px', height: '40px', display: 'flex', cursor:'pointer' }}>
    {children}
</div>

const MainPanel = ({ rightPanelContent, leftPanelContent, centerPanelContent, topics }: Props) => {

    const [selectedId, setSelectedId] = React.useState();
    const { data, publish } = topics;
    const [openPanel, setOpenPanel] = React.useState(false);
    const elem = React.useRef(null);
    const router = useRouter();
    const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

    const onCancelEdit = () => {
        router.push({
            query: {}
        })
    }

    useEffect(() => {
        setSelectedId(data['zoomToNode'].id)
    }, [data['zoomToNode']])

    useEffect(() => {
        const handleClosePanel = () => setOpenPanel(false)
        const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY })

        window.addEventListener('dragenter', handleClosePanel)
        window.addEventListener('mousemove', handleMouseMove)

        return () => {
            window.removeEventListener('dragenter', handleClosePanel)
            window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [])

    const getLeftWidth = () => {
        const totalWidth = window.innerWidth
        let percentage = (300 / totalWidth) * 100;
        return percentage;
    }

    return (
        <div style={{ flex: 1, display: 'flex' }}>
            <div style={{ flex: 1, display: openPanel ? 'flex' : 'none', position: 'absolute', width: getLeftWidth(), zIndex: 99999999 }}>
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
                style={{
                    display: openPanel ? "none":"flex",
                    position: 'fixed',
                    zIndex: 99999999999999999999,
                    flexDirection: 'column',
                    left: '20px',
                    top: 'calc(50vh - 80px)'
                }}
            >
                <FloatingIcon onClick={() => setOpenPanel(true)}>
                    <Component
                        color="white"
                    />
                </FloatingIcon>
                <FloatingIcon
                    onClick={() => publish("savenodes", { value: 'visual-ui' })}
                >
                    <Save
                        color="white"
                    />
                </FloatingIcon>
                <FloatingIcon
                    onClick={onCancelEdit}
                >
                    <X color="white"></X>
                </FloatingIcon>
            </div>
            <PanelGroup autoSaveId="example" direction="horizontal" style={{ height: '100vh', display: "flex" }}>
                <Panel>
                    <div style={{ flex: 1, height: '100%', overflowY: 'auto' }}>
                        {centerPanelContent}
                    </div>
                </Panel>
                <Panel collapsible={true}>
                    <div style={{ flex: 1, height: '100%', display: 'flex' }}>
                        {rightPanelContent}
                    </div>
                </Panel>
            </PanelGroup>
        </div>
    );
}

export default memo(withTopics(MainPanel, { topics: ["zoomToNode"] }));