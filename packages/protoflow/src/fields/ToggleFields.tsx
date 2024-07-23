import React, { useContext } from 'react';
import useTheme from '../diagram/Theme';
import { FlowStoreContext } from '../store/FlowsStore';
import { CustomField } from '.';
import Text from '../diagram/NodeText'
import { useThemeSetting } from '@tamagui/next-theme'
import { getDataFromField, getFieldValue } from '../utils';

export const getToggleTypes = () => ['toggle-boolean']

export default ({ nodeData = {}, item, node }) => {
    const useFlowsStore = useContext(FlowStoreContext)
    const setNodeData = useFlowsStore(state => state.setNodeData)
    const { resolvedTheme } = useThemeSetting();

    const { field, label, type, menuActions } = item

    const value = getFieldValue(field, nodeData)

    const onValueChange = (val) => {
        setNodeData(node.id, { ...nodeData, [field]: getDataFromField(val, field, nodeData, { kind: 'FalseKeyword' }) })
    }

    const inputBorder = useTheme('inputBorder')
    const borderColor = useTheme('inputBorder').split(' ')[2]

    const ToggleGroup = ({ defaultValue = false, values }) => <div
        style={{
            width: '100%',
            height: '38px',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            backgroundColor: useTheme('inputBackgroundColor'),
            border: inputBorder,
            borderRadius: '0.5ch',
            gap: '4px',
        }}
    >
        {values.map((v) => <ItemButton defaultValue={defaultValue} itemValue={v} onPress={onValueChange} />)}
    </div>

    const ItemButton = ({ itemValue, onPress, defaultValue = false }) => {
        const isSelected = value == itemValue //|| !value && itemValue == defaultValue
        const isLight = resolvedTheme == 'light'
        return <button
            onClick={() => onPress(itemValue)}
            style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: isSelected && isLight ? borderColor : undefined,
                borderRadius: '2px',
                height: '34px',
                fontSize: '14px',
            }}
        >
            <Text style={{ color: !isSelected ? useTheme('disableTextColor') : isSelected && isLight ? useTheme('textColor') : '' }}>
                {itemValue ? 'true' : 'false'}
            </Text>
        </button>
    }

    const getInput = () => {
        switch (type) {
            case 'toggle-boolean':
            default:
                return <>
                    <ToggleGroup values={[false, true]} />
                </>
        }
    }

    return <CustomField label={label} input={getInput()} menuActions={menuActions} />

}