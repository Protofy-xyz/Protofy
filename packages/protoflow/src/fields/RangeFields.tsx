import React, { useContext } from 'react';
import useTheme from '../diagram/Theme';
import { FlowStoreContext } from '../store/FlowsStore';
import { CustomField } from '.';
import { getDataFromField } from '../utils';

export const getRangeTypes = () => ['range-theme', 'range-px', 'range']

export default ({ nodeData = {}, item, node }) => {
    const useFlowsStore = useContext(FlowStoreContext)
    const setNodeData = useFlowsStore(state => state.setNodeData)

    const defData = {
        "range-theme": { // e.g. "$10"
            pre: s => s[0] == "$" ? s.split("$")[1] : s,
            post: s => "$" + s,
            max: 20,
            min: 0,
            kind: 'StringLiteral'
        },
        "range-px": { // e.g. "10px"
            pre: s => (s[s.length - 2] == "p" && s[s.length - 1] == "x") ? s.slice(0, -2) : s,
            post: s => s + "px",
            max: 100,
            min: 0,
            kind: 'StringLiteral'
        },
        "default": {
            pre: s => s,
            post: s => s,
            max: 100,
            min: 0,
            step: 1,
            kind: 'NumericLiteral'
        }
    }

    const { field, label, type, data, menuActions } = item

    const itemData = nodeData[field]
    const value = itemData?.value

    const rangeData = { ...defData[type], ...data }
    const pre = rangeData?.pre ?? defData['default']?.pre
    const post = rangeData?.post ?? defData['default']?.post
    const max = rangeData?.max ?? defData['default']?.max
    const min = rangeData?.min ?? defData['default']?.min
    const step = rangeData?.step ?? defData['default']?.step
    const kind = rangeData?.kind ?? defData['default']?.kind

    const onValueChange = (val) => {
        setNodeData(node.id, { ...nodeData, [field]: getDataFromField(val, field, nodeData, { kind }) })
    }

    const getInput = () => {
        const DefaultAbbr = 'D.'
        const initialRangeValue = value ?? DefaultAbbr
        const [tmpRangeValue, setTmpRangeValue] = React.useState(pre(initialRangeValue));
        const currentVal = !value ? DefaultAbbr : tmpRangeValue

        return <>
            <div style={{ fontSize: '14px', position: 'relative', top: '3px', width: max.toString().length * 18, textAlign: 'left', color: useTheme('textColor') }}>{post(currentVal)}</div>
            <input type="range" style={{ width: '100%', marginTop: '6px', accentColor: value ? useTheme('interactiveColor') : useTheme('disableTextColor'), height: '5px', borderWidth: '4px solid blue', backgroundColor: useTheme("separatorColor"), borderRadius: '10px' }}
                step={step}
                onChange={(event: any) => setTmpRangeValue(event.target.value)}
                onMouseUp={() => onValueChange(post(tmpRangeValue))}
                value={currentVal}
                min={min}
                max={max}
            />
        </>
    }

    return <CustomField label={label} input={getInput()} menuActions={menuActions} />

}