import React, { useRef } from 'react';
import Rnd from 'react-rnd';
import { GripHorizontal, Expand, Minimize, X, Workflow } from 'lucide-react';

export default ({ children }) => {
    const rndRef: any = useRef()
    const [visibleFlows, setVisibleFlows] = React.useState(false);
    const [expanded, setExpanded] = React.useState(false);
    const compressedSize = 50
    const compressedPosition = { x: window.outerWidth * 0.5, y: window.innerHeight - 80 }

    const borderRadius = expanded ? '10px' : '100%'
    const [size, setSize] = React.useState({ x: compressedSize, y: compressedSize });
    const [previewState, setPreviewState] = React.useState({ size: { x: 400, y: 400 }, position: { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 } });
    const [expandedState, setExpandedState] = React.useState({ size: { x: window.innerWidth * 0.3, y: window.innerHeight * 0.8 }, position: { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 } });

    const onShowToggle = () => {
        const newState = !visibleFlows
        setVisibleFlows(newState)
        if (newState) { // visible
            setSize(previewState.size)
        } else {
            setPreviewState(s => { return ({ ...s, size: size }) })
            setSize({ x: compressedSize, y: compressedSize })
        }
    }
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
        if (visibleFlows) {
            setPreviewState(s => { return ({ ...s, position: { x: d.x, y: d.y } }) })
        }
    }

    return (
        <>
            <div
                onClick={() => onShowToggle()}
                style={{
                    backgroundColor: 'black', height: '40px', width: '40px',
                    padding: '10px', cursor: 'grab', position: 'absolute',
                    zIndex: 1000, borderRadius: '100%', display: 'flex',
                    alignItems: 'center', alignSelf: 'center',
                    top: window.innerHeight * 0.4 - 20, left: 20
                }}
            >
                <Workflow color="white" style={{ cursor: 'grab' }} />
            </div>
            {visibleFlows
                // RESIZABLE
                ? <Rnd
                    ref={rndRef}
                    minWidth={0}
                    minHeight={0}
                    size={{ height: size.y, width: size.x }}
                    position={visibleFlows ? previewState.position : compressedPosition}
                    onResize={onResize}
                    onDragStop={onDragStop}
                    bounds="window"
                    lockAspectRatio={!expanded}
                >
                    {/* ACTIONS BUTTONS */}
                    <div style={{ position: 'absolute', zIndex: 1000, top: '1rem', left: '-50px', display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                        <div
                            style={{
                                backgroundColor: 'black', height: '40px', width: '40px',
                                padding: '10px', cursor: 'grab',
                                zIndex: 1000, borderRadius: '100%', display: 'flex',
                                alignItems: 'center'
                            }}
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
                            onMouseDown={e => e.stopPropagation()}
                            style={{
                                backgroundColor: 'black', height: '40px', width: '40px',
                                padding: '10px', cursor: 'pointer',
                                zIndex: 1000, borderRadius: '100%', display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <X color="white" style={{ cursor: 'grab' }} />
                        </div>
                    </div>

                    {/* FLOWS */}
                    <div style={{
                        height: '100%', width: '100%', display: 'flex',
                        flex: 1, overflow: 'hidden', borderRadius: borderRadius,
                        flexDirection: 'column', cursor: 'grab'
                    }}
                    >
                        {children}
                    </div>
                </Rnd>
                : <> </>
            }
        </>
    )
};