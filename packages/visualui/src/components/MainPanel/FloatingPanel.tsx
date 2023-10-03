import React, { useRef, useEffect } from 'react';
import Rnd from 'react-rnd';
import { GripHorizontal, Expand, Minimize, X } from 'lucide-react';
import { withTopics } from "react-topics";

const FloatingPanel = ({ children, topics, visibleFlows, setVisibleFlows, size, setSize, previewState, setPreviewState, onShowToggle }) => {
    const { data } = topics;
    const rndRef: any = useRef()
    const [isDragging, setIsDragging] = React.useState(false);
    const [expanded, setExpanded] = React.useState(false);
    const [selectedId, setSelectedId] = React.useState();
    const [mousePos, setMousePos] = React.useState({x: 0, y: 0});

    const compressedPosition = { x: window.outerWidth * 0.5, y: window.innerHeight - 80 }

    const [expandedState, setExpandedState] = React.useState({ size: { x: window.innerWidth * 0.3, y: window.innerHeight * 0.8 }, position: { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 } });

    
    const onExpandToggle = () => {
        const newState = !expanded
        setExpanded(newState)
        if (newState) {
            if (!rndRef.current) return
            const currentYPos = rndRef.current.props.position.y
            const expandedHeight = expandedState.size.y
            const windowHeight = window.innerHeight
            if ((currentYPos + expandedHeight) > windowHeight) {
                rndRef.current.props.position.y = windowHeight - expandedHeight
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
    const onDragStop = (e, d) => {
        setIsDragging(false)
        if (visibleFlows) {
            setPreviewState(s => { return ({ ...s, position: { x: d.x, y: d.y } }) })
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
        const handleMouse = (e) => setMousePos({x: e.clientX, y: e.clientY})
        window.addEventListener('mousemove', handleMouse)
        return () => window.removeEventListener('mousemove', handleMouse)
    }, [])

    return (
        <>
            <Rnd
                ref={rndRef}
                minWidth={0}
                minHeight={0}
                size={{ height: size.y, width: size.x }}
                default={{ height: previewState.size.y, width: previewState.size.x, x: previewState.position.x, y: previewState.position.y }}
                position={visibleFlows ? previewState.position : compressedPosition}
                onResize={onResize}
                onDragStart={() => setIsDragging(true)}
                onDragStop={onDragStop}
                bounds="window"
                lockAspectRatio={!expanded}
            >
                {/* ACTIONS BUTTONS */}
                <div style={{ position: 'absolute', zIndex: 1000, top: '1rem', left: '-50px', display: visibleFlows ? 'flex' : 'none', gap: '1rem', flexDirection: 'column' }}>
                    <div
                        style={{
                            backgroundColor: 'black', height: '40px', width: '40px',
                            padding: '10px', cursor: 'grab',
                            zIndex: 1000, borderRadius: '100%', display: 'flex',
                            alignItems: 'center'
                        }}
                        onMouseUp={e => e.stopPropagation()}
                    >
                        <GripHorizontal color="white" style={{ cursor: 'grab' }} />
                    </div>
                    <div
                        onClick={() => onExpandToggle()}
                        onMouseDown={e => e.stopPropagation()}
                        style={{
                            backgroundColor: 'black', height: '40px', width: '40px',
                            padding: '10px', cursor: 'grab',
                            zIndex: 1000, borderRadius: '100%', display: 'flex', alignItems: 'center',
                            top: '-32px'
                        }}
                    >
                        {expanded
                            ? <Minimize color="white" style={{ cursor: 'pointer' }} />
                            : <Expand color="white" style={{ cursor: 'pointer' }} />
                        }

                    </div>
                    <div
                        onClick={onShowToggle}
                        onMouseDown={e => { e.stopPropagation(); e.preventDefault() }}
                        style={{
                            backgroundColor: 'black', height: '40px', width: '40px',
                            padding: '10px', cursor: 'pointer',
                            zIndex: 1000, borderRadius: '100%', display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <X color="white" />
                    </div>
                </div>

                {/* FLOWS */}
                <div style={{
                    height: '100%', width: '100%', position: 'absolute',
                    flex: 1, overflow: 'hidden', borderRadius: expanded ? '10px' : '100%',
                    flexDirection: 'column', cursor: 'grab', top: visibleFlows ? '' : window.outerHeight * 3
                }}
                >
                    {children}
                </div>
            </Rnd>
        </>
    )
};

export default withTopics(FloatingPanel, { topics: ["zoomToNode"] })