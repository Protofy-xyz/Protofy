import React, { useContext, useEffect, useState } from 'react';
import { FlowStoreContext } from '../store/FlowsStore';
import Input from '../diagram/NodeInput'
import { getDataFromField } from '../utils';
import { usePrimaryColor } from '../diagram/Theme';

export default ({ nodeData = {}, node, item}) => {
    const useFlowsStore = useContext(FlowStoreContext)
    const setNodeData = useFlowsStore(state => state.setNodeData)
    const {field, type} = item

    const onUpdate = (field, val) => {
        setNodeData(node.id, { ...nodeData, [field]: getDataFromField(val, field, nodeData) })
    }

    const getFieldData = (field) => {
        return nodeData[field]?.value ? nodeData[field].value : null 
    }

    useEffect(() => {
        console.log('nodedata', nodeData)
    }, [nodeData])

    const TimeComponent = () => {
        const [time, setTime] = useState({ 
            hours: getFieldData(field.hours) !== null 
                ? getFieldData(field.hours) 
                : 0, 
            minutes: getFieldData(field.minutes) !== null 
                ? getFieldData(field.minutes)
                : 0
        }); 

        const localUpdate = (type, val) => {
            let numVal = Number(val)
            if (type === "minutes" && numVal >= 0 && numVal < 60) {
                let minutes = getFieldData(field.hours)
                minutes = val
                setTime(prev => ({...prev, minutes}))
            } else if (type === "hours" && numVal >= 0 && numVal < 24) {
                let hours = getFieldData(field.minutes)
                hours = val
                setTime(prev => ({...prev, hours}))
            }
        }

        const update = (type, val) => {
            let numVal = Number(val)
            if (type === "minutes" && numVal >= 0 && numVal < 60) {
                time.minutes = val
                onUpdate(field.minutes, time.minutes)
            } else if (type === "hours" && numVal >= 0 && numVal < 24) {
                time.hours = val
                onUpdate(field.hours, time.hours)
            }
        }

        return <div
            style={{position: 'relative', width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', 
            alignItems: 'center', gap: '12px'}}
        >
            <div style={{width: '100%', position: 'relative', display: 'flex'}}>
                <Input 
                    style={{ width: '50px'}}
                    placeHolder="00"
                    type="text"
                    value={time.hours ?? 0}
                    onChange={(e) => localUpdate('hours', e.target.value)}
                    onBlur={(e) =>  update('hours', e.target.value)}
                />
            </div>
            <p style={{width: 'fit-content'}}>:</p>
            <div style={{width: '100%', position: 'relative', display: 'flex'}}>
                <Input 
                    style={{ width: '50px'}}
                    placeHolder="00"
                    type="text"
                    value={time.minutes ?? 0}
                    onChange={(e) => localUpdate('minutes', e.target.value)}
                    onBlur={(e) =>  update('minutes', e.target.value)}
                />
            </div>
        </div>
    }

    const DaysComponent = () => {
        const primaryColor = usePrimaryColor()
        const days = [
            { long: "Monday", short: "M" },
            { long: "Tuesday", short: "T" },
            { long: "Wednesday", short: "W" }, 
            { long: "Thursday", short: "T" },
            { long: "Friday", short: "F" },
            { long: "Saturday", short: "S" },
            { long: "Sunday", short: "S" }
        ];
        
        const update = (day, selected) => {
            let daysArray = getFieldData(field.days) !== null 
                ? getFieldData(field.days).split(',')
                : []
            if (selected) {
                // remove element from array
                let index = daysArray.indexOf(day);  
                daysArray.splice(index, 1); 
            } else {
                // add element to array
                daysArray.push(day); 
            }  

            onUpdate(field.days, daysArray.join(','))  
        } 

        return <div
            style={{display: 'flex', flexDirection: 'row', justifyItems: 'center', alignContent: 'center', backgroundColor: '#ececec30', 
                borderRadius: '10px', padding: '5px 10px', gap: '5px'}}
        >
            {
                days.map(day => {
                    let selected = (getFieldData(field.days) !== null ? getFieldData(field.days).split(',') : []).includes(day.long); 
                    return <p 
                        key={day.long}
                        style={{
                            height: '40px', width: '40px', display: 'grid', placeItems: 'center', borderRadius: '5px',
                            cursor: 'pointer', backgroundColor: selected  ? primaryColor : 'transparent'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = selected ? primaryColor: '#00257a20'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selected ? primaryColor : 'transparent'}
                        onClick={(e) => {
                            e.stopPropagation()
                            update(day.long, selected)   
                        }}
                    >{day.short}</p>
                })
            }
        </div> 
    }
    
    switch (type) {
        case 'time': 
            return <TimeComponent/> 
        case 'days': 
            return <DaysComponent/>  
    }

    return <div style={{ height: '100%', width: '100%', 
        display: 'flex', flexDirection: 'column', justifyItems: 'flex-start', alignContent: 'flex-start'
    }}>
        WeekdayPicker type not provided
    </div>

}
