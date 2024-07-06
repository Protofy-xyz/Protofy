import { forwardRef } from 'react';
import Rnd from 'react-rnd';
import { Move, Maximize, Minimize, X } from 'lucide-react';

export default forwardRef(({ children, visibleFlows, size, expanded, previewState, onShowCropToggle, onExpandToggle, onResize, onDragStop }: any, ref: any) => {

    const isVisibleCrop = visibleFlows == 'crop'
    const isVisibleFull = visibleFlows == 'full'

    const compressedPosition = { x: window.outerWidth * 0.5, y: window.innerHeight - 80 }

    return (
        <>
            <Rnd
                ref={ref}
                minWidth={300}
                minHeight={300}
                size={{ height: size.y, width: size.x }}
                default={{ height: previewState.size.y, width: previewState.size.x, x: previewState.position.x, y: previewState.position.y }}
                position={isVisibleCrop ? previewState.position : compressedPosition}
                onResize={onResize}
                onDragStop={onDragStop}
                bounds="window"
                lockAspectRatio={!expanded}
            >
                {/* ACTIONS BUTTONS */}
                <div style={{ position: 'absolute', zIndex: 1000, top: '1rem', left: '-50px', display: isVisibleCrop ? 'flex' : 'none', gap: '1rem', flexDirection: 'column' }}>
                    <div
                        style={{
                            backgroundColor: 'black', height: '40px', width: '40px',
                            padding: '10px', cursor: 'grab',
                            zIndex: 1000, borderRadius: '100%', display: 'flex',
                            alignItems: 'center'
                        }}
                        onMouseUp={e => e.stopPropagation()}
                    >
                        <Move color="white" style={{ cursor: 'grab' }} />
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
                            : <Maximize color="white" style={{ cursor: 'pointer' }} />
                        }

                    </div>
                    <div
                        onClick={onShowCropToggle}
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
                    flexDirection: 'column', cursor: 'grab', top: isVisibleCrop ? '' : window.outerHeight * 3
                }}
                >
                    {!isVisibleFull ? children : null}
                </div>
            </Rnd>
            <div style={{
                width: window.innerWidth,
                height: window.innerHeight,
                position: 'absolute',
                display: isVisibleFull ? 'flex' : 'none'
            }}>
                {isVisibleFull ? children : null}
            </div>
        </>
    )
});