import React, { useContext } from 'react';
import useTheme from '../diagram/Theme';
import { FlowStoreContext } from '../store/FlowsStore';
import { CustomField } from '.';
import { XStack, Button } from "@my/ui"
import Text from '../diagram/NodeText'

export const getToggleTypes = () => ['toggle-boolean']

export default ({ nodeData = {}, item, node }) => {
    const useFlowsStore = useContext(FlowStoreContext)
    const setNodeData = useFlowsStore(state => state.setNodeData)

    const { field, label, type, fieldType } = item

    const fieldKey = field.replace(fieldType + '-', '')
    const data = nodeData[field]
    const value = data?.value

    const onValueChange = (val) => {
        // current case is fieldType == "prop"
        setNodeData(node.id, { ...nodeData, [field]: { ...data, key: fieldKey, value: val, kind: 'FalseKeyword' } })
    }

    const ToggleGroup = ({ defaultValue = false, values }) => <XStack
        width="100%"
        height='38px'
        space="4px"
        paddingHorizontal="2px"
        backgroundColor={useTheme('inputBackgroundColor')}
        alignItems='center'
        justifyContent='space-around'
        borderRadius="$2"
    >
        {values.map((v) => <ItemButton defaultValue={defaultValue} itemValue={v} onPress={onValueChange} />)}
    </XStack>

    const ItemButton = ({ itemValue, onPress, defaultValue = false }) => {
        const isSelected = value == itemValue //|| !value && itemValue == defaultValue
        return <Button
            onPress={() => onPress(itemValue)}
            f={1}
            chromeless={!isSelected}
            size={"$3"}
            height="34px"
            borderRadius="$1"
            fontSize="$4"
        >
            <Text> {itemValue ? 'true' : 'false'} </Text>
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

    return <CustomField label={label} input={getInput()} />

}