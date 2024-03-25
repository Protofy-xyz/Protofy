import React, { useContext } from 'react';
import useTheme from '../diagram/Theme';
import { FlowStoreContext } from '../store/FlowsStore';
import { CustomField } from '.';
import { XStack, Button } from "@my/ui"
import Text from '../diagram/NodeText'
import { useThemeSetting } from '@tamagui/next-theme'
import { getNodeDataField } from '../utils';

export const getToggleTypes = () => ['toggle-boolean']

export default ({ nodeData = {}, item, node }) => {
    const useFlowsStore = useContext(FlowStoreContext)
    const setNodeData = useFlowsStore(state => state.setNodeData)
    const { resolvedTheme } = useThemeSetting();

    const { field, label, type, menuActions } = item

    const data = nodeData[field]
    const value = data?.value

    const onValueChange = (val) => {
        setNodeData(node.id, { ...nodeData, [field]: getNodeDataField(val, field, nodeData, { kind: 'FalseKeyword' }) })
    }

    const borderWidth = useTheme('inputBorder').split(' ')[0]
    const borderColor = useTheme('inputBorder').split(' ')[2]

    const ToggleGroup = ({ defaultValue = false, values }) => <XStack
        width="100%"
        height='38px'
        space="4px"
        paddingHorizontal="2px"
        backgroundColor={useTheme('inputBackgroundColor')}
        borderWidth={borderWidth}
        borderColor={borderColor}
        alignItems='center'
        justifyContent='space-around'
        borderRadius="$2"
    >
        {values.map((v) => <ItemButton defaultValue={defaultValue} itemValue={v} onPress={onValueChange} />)}
    </XStack>

    const ItemButton = ({ itemValue, onPress, defaultValue = false }) => {
        const isSelected = value == itemValue //|| !value && itemValue == defaultValue
        const isLight = resolvedTheme == 'light'
        return <Button
            onPress={() => onPress(itemValue)}
            f={1}
            chromeless={!isSelected}
            backgroundColor={isSelected && isLight ? borderColor : undefined}
            size={"$3"}
            height="34px"
            borderRadius="$1"
            fontSize="$4"
        >
            <Text style={{ color: !isSelected ? useTheme('disableTextColor') : isSelected && isLight ? useTheme('textColor') : '' }}>
                {itemValue ? 'true' : 'false'}
            </Text>
        </Button>
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