import React, { useContext, useState } from 'react';
import useTheme from '../diagram/Theme';
import { FlowStoreContext } from '../store/FlowsStore';
import { CustomField } from '.';
import { Type, Hash, Braces, ToggleLeft, VariableIcon } from 'lucide-react';
import Input from '../diagram/NodeInput'
import { getDataFromField, getFieldType, getFieldValue } from '../utils';

export const getInputTypes = () => ['input']

export default ({ nodeData = {}, item, node }) => {
    const useFlowsStore = useContext(FlowStoreContext)
    const setNodeData = useFlowsStore(state => state.setNodeData)

    const { field, label, type, menuActions } = item

    const data = nodeData[field]
    const value = getFieldValue(field, nodeData)

    const [tmpValue, setTmpValue] = useState(value)

    const icons = {
        "StringLiteral": Type,
        "NumericLiteral": Hash,
        "TrueKeyword": ToggleLeft,
        "ObjectLiteralExpression": Braces,
        "FalseKeyword": ToggleLeft,
        "Identifier": VariableIcon
    }
    const toggleableList = Object.keys(icons).filter(i => i != 'Identifier')

    const defaultKindValue = toggleableList[0]
    const kindValue = data?.kind ?? defaultKindValue

    const onValueChange = (val) => {
        setNodeData(node.id, { ...nodeData, [field]: getDataFromField(val, field, nodeData) })
    }

    const onToggleType = () => {
        setNodeData(node.id, {
            ...nodeData, [field]: {
                ...data,
                kind: toggleableList[(toggleableList.indexOf(kindValue) + 1) % (toggleableList.length - 1)]
            }
        })
    }



    const getInput = () => {
        switch (type) {
            // cases: boolean, number, string, object
            case 'input':
            default:
                const enabledToggle = toggleableList.includes(kindValue)
                const isDetailedType = getFieldType(field) == "detailed"
                return <>
                    {icons[kindValue] && isDetailedType
                        ? <div
                            style={{ padding: '8px', justifyContent: 'center', position: 'absolute', zIndex: 100, cursor: enabledToggle ? 'pointer' : '' }}
                            onClick={enabledToggle ? onToggleType : null}
                        >
                            {React.createElement(icons[kindValue], { size: 16, color: enabledToggle ? useTheme('interactiveColor') : useTheme('disableTextColor') })}
                        </div>
                        : <></>}
                    <Input
                        onBlur={() => onValueChange(tmpValue)}
                        style={{
                            fontSize: useTheme('nodeFontSize'),
                            fontWeight: 'medium', paddingLeft: isDetailedType ? '38px' : undefined
                        }}
                        options={item.data?.options}
                        value={tmpValue}
                        placeholder="default"
                        onChange={t => setTmpValue(t.target.value)}
                    />
                </>
        }
    }

    return <CustomField label={label} input={getInput()} menuActions={menuActions}/>

}