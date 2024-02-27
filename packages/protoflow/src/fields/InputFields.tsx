import React, { useContext, useState } from 'react';
import useTheme from '../diagram/Theme';
import { FlowStoreContext } from '../store/FlowsStore';
import { CustomField } from '.';
import { Type, Hash, Braces, ToggleLeft } from 'lucide-react';
import Input from '../diagram/NodeInput'

export const getInputTypes = () => ['input']

export default ({ nodeData = {}, item, node }) => {
    const useFlowsStore = useContext(FlowStoreContext)
    const setNodeData = useFlowsStore(state => state.setNodeData)

    const { field, label, type, fieldType } = item

    const fieldKey = field.replace(fieldType + '-', '')
    const data = nodeData[field]
    const value = data?.value

    const [tmpValue, setTmpValue] = useState(value)

    const icons = {
        "StringLiteral": Type,
        "NumericLiteral": Hash,
        "TrueKeyword": ToggleLeft,
        "ObjectLiteralExpression": Braces,
        "FalseKeyword": ToggleLeft
    }

    const defaultKindValue = Object.keys(icons)[0]
    const kindValue = data?.kind ?? defaultKindValue

    const onValueChange = (val) => {
        // current case is fieldType == "prop"
        setNodeData(node.id, { ...nodeData, [field]: { ...data, key: fieldKey, value: val, kind: kindValue } })
    }

    const onToggleType = () => {
        setNodeData(node.id, {
            ...nodeData, [field]: {
                ...data,
                kind: Object.keys(icons)[(Object.keys(icons).indexOf(kindValue) + 1) % (Object.keys(icons).length - 1)]
            }
        })
    }



    const getInput = () => {
        switch (type) {
            // cases: boolean, number, string, object
            case 'input':
            default:
                return <>
                    {icons[kindValue]
                        ? <div
                            style={{ padding: '8px', justifyContent: 'center', position: 'absolute', zIndex: 100, cursor: 'pointer' }}
                            onClick={onToggleType}
                        >
                            {React.createElement(icons[kindValue], { size: 16, color: useTheme('interactiveColor') })}
                        </div>
                        : <></>}
                    <Input
                        onBlur={() => onValueChange(tmpValue)}
                        style={{
                            fontSize: useTheme('nodeFontSize'),
                            fontWeight: 'medium', paddingLeft: '38px'
                        }}
                        value={tmpValue}
                        placeholder="default"
                        onChange={t => setTmpValue(t.target.value)}
                    />
                </>
        }
    }

    return <CustomField label={label} input={getInput()} />

}