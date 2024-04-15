import React, { useContext, useState } from 'react';
import useTheme from '../diagram/Theme';
import { FlowStoreContext } from '../store/FlowsStore';
import { CustomField } from '.';
import Input from '../diagram/NodeInput'
import { getDataFromField, getFieldType, getFieldValue } from '../utils';
import { getKindIcon, getNextKind, getTypeByKind } from '../utils/typesAndKinds';

export const getInputTypes = () => ['input']

export default ({ nodeData = {}, item, node }) => {
    const useFlowsStore = useContext(FlowStoreContext)
    const setNodeData = useFlowsStore(state => state.setNodeData)

    const { field, label, type, menuActions } = item

    const data = nodeData[field]
    const value = getFieldValue(field, nodeData)

    const [tmpValue, setTmpValue] = useState(value)

    const kindValue = data?.kind ?? "StringLiteral"

    const onValueChange = (val) => {
        setNodeData(node.id, { ...nodeData, [field]: getDataFromField(val, field, nodeData) })
    }

    const onToggleType = () => {
        setNodeData(node.id, {
            ...nodeData, [field]: {
                ...data,
                kind: getNextKind(kindValue)
            }
        })
    }



    const getInput = () => {
        switch (type) {
            // cases: boolean, number, string, object
            case 'input':
            default:
                const isDetailedType = getFieldType(field) == "detailed"
                return <>
                    {getTypeByKind(kindValue) && isDetailedType
                        ? <div
                            style={{ padding: '8px', justifyContent: 'center', position: 'absolute', zIndex: 100, cursor: 'pointer' }}
                            onClick={onToggleType}
                        >
                            {React.createElement(getKindIcon(kindValue), { size: 16, color: useTheme('interactiveColor') })}
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

    return <CustomField label={label} input={getInput()} menuActions={menuActions} />

}