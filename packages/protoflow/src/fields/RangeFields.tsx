import React, { useContext } from 'react';
import useTheme from '../diagram/Theme';
import { FlowStoreContext } from '../store/FlowsStore';
import { CustomField } from '.';

export const getRangeTypes = () => ['range-theme']

export default ({ nodeData = {}, item, node }) => {
    const useFlowsStore = useContext(FlowStoreContext)
    const setNodeData = useFlowsStore(state => state.setNodeData)

    const { field, label, type, fieldType } = item

    const fieldKey = field.replace(fieldType + '-', '')
    const data = nodeData[field]
    const value = data?.value

    const onValueChange = (val) => {
        setNodeData(node.id, { ...nodeData, [field]: { ...data, key: fieldKey, value: val, kind: 'StringLiteral' } })
    }

    const getInput = () => {
        switch (type) {
            case 'range-theme':
                const pre = (s) => s[0] == "$" ? s.split("$")[1] : s
                const post = (s) => "$" + s
                const initialRangeValue = value ?? 0
                const [tmpRangeValue, setTmpRangeValue] = React.useState(pre(initialRangeValue));
                const max = 20

                return <>
                    <div style={{ fontSize: '14px', position: 'relative', top: '3px', width: max.toString().length * 18, textAlign: 'left', color: useTheme('textColor') }}>{post(tmpRangeValue)}</div>
                    <input type="range" style={{ width: '100%', marginTop: '6px', accentColor: useTheme('interactiveColor'), height: '5px', borderWidth: '4px solid blue', backgroundColor: useTheme("inputBackgroundColor"), borderRadius: '10px' }}
                        step={1}
                        onChange={(event: any) => setTmpRangeValue(event.target.value)}
                        onMouseUp={() => onValueChange(post(tmpRangeValue))}
                        value={tmpRangeValue} min={0} max={20} />
                </>
        }
    }

    return <CustomField label={label} input={getInput()} />

}