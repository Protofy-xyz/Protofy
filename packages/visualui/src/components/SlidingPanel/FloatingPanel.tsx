import React, { useRef } from 'react';
import Rnd from 'react-rnd';
import { GripHorizontal, ChevronDown, ChevronUp } from 'lucide-react';

export default ({ children }) => {
    const [visibleFlows, setVisibleFlows] = React.useState(false);
    const [height, setHeight] = React.useState();
    const rndRef = useRef()
    const borderRadius = 20

    const onChange = (visible) => {
        if (!rndRef.current) return
        // console.log('DEV: rndRef.current: ', rndRef.current.style)
        // const currentHeight = rndRef.current?.style.height
        if (visible) {
            setVisibleFlows(false)
        } else {
            setVisibleFlows(true)
        }
    }

    return (
        <Rnd
            default={{
                x: 150,
                y: 205,
                width: 500,
                height: 400,
            }}
            minWidth={300}
            minHeight={400}
            bounds="window"
            style={{ borderRadius: borderRadius, overflow: 'hidden', border: '0px solid red' }}
        >
            <div  style={{ height: '100%', width: '100%', display: 'flex', flex: 1, flexDirection: 'column' }}>
                <div
                    onDoubleClick={() => onChange(!visibleFlows)}
                    style={{
                        width: '100%', backgroundColor: 'black', height: '50px',
                        justifyContent: 'space-between', display: 'flex',
                        padding: '10px', cursor: 'grab'
                    }}
                >
                    {
                        visibleFlows
                            ?
                            <ChevronUp onClick={() => onChange(false)} color={'white'} style={{ cursor: 'pointer' }} />
                            : <ChevronDown onClick={() => onChange(true)} color={'white'} style={{ cursor: 'pointer' }} />
                    }
                    <div style={{ color: 'white' }}>Flows</div>
                    <GripHorizontal color="white" style={{ cursor: 'grab' }} />
                </div>
                {<div style={{
                    width: '100%',
                    backgroundColor: 'black',
                    height: '100%',
                    // display: visibleFlows ? 'flex' : 'none',

                    display: 'flex',
                    cursor: 'grab'
                }}>
                    {children}
                </div>}
            </div>
        </Rnd>
    )
};