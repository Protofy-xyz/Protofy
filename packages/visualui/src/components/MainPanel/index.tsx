
import React, { memo, useRef, useEffect } from "react";
import { withTopics } from "react-topics";
import SPanel from 'react-sliding-side-panel';
import { Component, Workflow, Save, X } from 'lucide-react';
import FloatingPanel from "./FloatingPanel";
import './floatingBar.css';

type Props = {
    rightPanelContent: React.Component | any,
    leftPanelContent: React.Component | any,
    centerPanelContent: React.Component | any,
    topics: any
};

const MainPanel = ({ rightPanelContent, leftPanelContent, centerPanelContent, topics }: Props) => {

    const floatingRef: any = useRef()
    const [openPanel, setOpenPanel] = React.useState(false);
    const [selectedId, setSelectedId] = React.useState();
    const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
    const { publish, data } = topics;

    const compressedSize = 50

    const [visibleFlows, setVisibleFlows] = React.useState('');
    const [size, setSize] = React.useState({ x: compressedSize, y: compressedSize });
    const [previewState, setPreviewState] = React.useState({ size: { x: 400, y: 400 }, position: { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 } });
    const [expandedState, setExpandedState] = React.useState({ size: { x: window.innerWidth * 0.3, y: window.innerHeight * 0.8 }, position: { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 } });
    const [expanded, setExpanded] = React.useState(false);

    const getLeftWidth = () => {
        const totalWidth = window.innerWidth
        let percentage = (290 / totalWidth) * 100;
        return percentage;
    }
    const onExpandFlows = () => {
        const newState = !expanded
        setExpanded(newState)
        if (newState) {
            if (!floatingRef && !floatingRef.current) return
            const currentYPos = floatingRef.current.props.position.y
            const expandedHeight = expandedState.size.y
            const windowHeight = window.innerHeight
            if ((currentYPos + expandedHeight) > windowHeight) {
                floatingRef.current.props.position.y = windowHeight - expandedHeight
            }
            setSize(expandedState.size)
        } else {
            setSize({ x: previewState.size.x, y: previewState.size.x })
        }
    }
    const onResize = (e, direction, ref) => {
        if (expanded) {
            setExpandedState(s => { return ({ ...s, size: size }) })
        } else {
            setPreviewState(s => { return ({ ...s, size: size }) })
        }
        setSize({ x: ref.offsetWidth, y: ref.offsetHeight })
    }
    const onShowCropedFlows = () => {
        const newState = !visibleFlows
        setVisibleFlows(newState ? 'crop' : '')
        if (newState) { // visible
            setSize(previewState.size)
        } else {
            setPreviewState(s => { return ({ ...s, size: size }) })
            setSize({ x: compressedSize, y: compressedSize })
        }
    }
    const onDragStop = (e, d) => {
        if (visibleFlows) {
            setPreviewState(s => { return ({ ...s, position: { x: d.x, y: d.y } }) })
        }
    }

    useEffect(() => {
        setSelectedId(data['zoomToNode'].id)
        if (data['zoomToNode']?.id != selectedId && !visibleFlows) {
            setVisibleFlows('crop')
            setSize(previewState.size)
            setPreviewState(s => {
                return { ...s, position: mousePos }
            })
        }
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

    return (
        <div style={{ flex: 1, display: 'flex' }}>
            <div style={{ flex: 1, display: openPanel ? 'flex' : 'none', position: 'absolute', width: getLeftWidth() }}>
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
                style={{ display: 'flex', position: 'fixed', flexDirection: 'column', alignSelf: 'center', left: '20px', zIndex: 10000 }}
            >
                {visibleFlows != 'full' ? <div
                    className="floatingIcon"
                    style={{ marginBottom: 20 }}
                    onClick={() => setOpenPanel(true)}
                >
                    <Component
                        color="white"
                    />
                </div> : null}
                <div
                    className="floatingIcon"
                    style={{ marginBottom: 20 }}
                    onClick={() => publish("savenodes", {})}
                >
                    <Save
                        color="white"
                    />
                </div>
                <div
                    onClick={() => setVisibleFlows(visibleFlows == 'full' ? '' : 'full')}
                    className="floatingIcon"
                >
                    {visibleFlows == 'full'
                        ? <X color="white"></X>
                        : <Workflow color="white" />
                    }
                </div>
            </div>
            <div style={{ position: 'absolute', zIndex: 1000, width: '0px' }}>
                <FloatingPanel
                    ref={floatingRef}
                    visibleFlows={visibleFlows}
                    size={size}
                    expanded={expanded}
                    previewState={previewState}
                    onShowCropToggle={onShowCropedFlows}
                    onExpandToggle={onExpandFlows}
                    onResize={onResize}
                    onDragStop={onDragStop}
                >
                    {rightPanelContent}
                </FloatingPanel>
            </div>
            {centerPanelContent}
        </div>
    );
}

export default memo(withTopics(MainPanel, { topics: ["zoomToNode"] }));