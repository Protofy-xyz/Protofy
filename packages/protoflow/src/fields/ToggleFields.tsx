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

    const ItemButton = ({ itemValue, onPress }) => (
        <Button
            onPress={() => onPress(itemValue)}
            f={1}
            chromeless={!(value == itemValue)}
            size={"$3"}
            height="34px"
            borderRadius="$1"
            fontSize="$4"
        >
            <Text> {itemValue ? 'true' : 'false'} </Text>
        </Button>)

    const getInput = () => {
        switch (type) {
            case 'toggle-boolean':
            default:
                return <>
                    <XStack
                        width="100%"
                        height='38px'
                        space="4px"
                        paddingHorizontal="2px"
                        backgroundColor={useTheme('inputBackgroundColor')}
                        alignItems='center'
                        justifyContent='space-around'
                        borderRadius="$2"
                    >
                        <ItemButton itemValue={false} onPress={onValueChange} />
                        <ItemButton itemValue={true} onPress={onValueChange} />
                    </XStack>
                </>
        }
    }

    return <CustomField label={label} input={getInput()} />

}