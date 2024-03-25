import React, { useContext } from 'react';
import { FlowStoreContext } from '../store/FlowsStore';
import {
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    AlignStartVertical, AlignEndVertical, AlignCenterVertical, StretchVertical,
    ArrowRightFromLine, ArrowLeftFromLine, ArrowDownFromLine, ArrowUpFromLine,
    AlignVerticalJustifyStart, AlignVerticalJustifyCenter, AlignVerticalJustifyEnd, AlignVerticalSpaceAround, AlignVerticalSpaceBetween
} from 'lucide-react';
import { CustomField } from '.';
import useTheme from '../diagram/Theme';
import { getNodeDataField } from '../utils';

export const getAlignmentTypes = () => ['alignment-text', 'alignment-items', 'alignment-flex', 'alignment-content']

export default ({ nodeData = {}, item, node }) => {
    const useFlowsStore = useContext(FlowStoreContext)
    const setNodeData = useFlowsStore(state => state.setNodeData)
    const deletePropNodeData = useFlowsStore(state => state.deletePropNodeData)

    const interactiveColor = useTheme('interactiveColor')
    const disableTextColor = useTheme('disableTextColor')

    const { field, label, type, fieldType, menuActions } = item

    const fieldKey = field.replace(fieldType + '-', '')
    const data = nodeData[field]
    const value = data?.value
    const rotation = getIconRotation()

    function getIconRotation() {
        let rot = '0deg';
        const isRowDir = Boolean(nodeData["prop-flexDirection"]?.value?.startsWith("row"))
        if (isRowDir) {
            rot = fieldKey == 'alignItems' ? '90deg' : '-90deg'
        }
        return rot;
    }

    const getIconColor = (type) => {
        if (value == type) return interactiveColor
        else return disableTextColor
    }

    const onToggleAlignment = (val) => {
        if (value == val) {// deletes nodeData 
            deletePropNodeData(node.id, field)
        }
        else { // add new prop to nodeData
            setNodeData(node.id, { ...nodeData, [field]: getNodeDataField(val, field, nodeData) })
        }
    }

    const Icon = ({ icon, name, rotate = '0deg' }) => {
        return <div title={name} style={{ cursor: 'pointer', rotate: rotate }} onClick={() => onToggleAlignment(name)}>
            {React.createElement(icon, { color: getIconColor(name) })}
        </div>
    }
    const getInput = () => {
        switch (type) {
            case 'alignment-text':
                return <div style={{ gap: '10px', display: 'flex' }}>
                    <Icon icon={AlignLeft} name={'left'} />
                    <Icon icon={AlignCenter} name={'center'} />
                    <Icon icon={AlignRight} name={'right'} />
                    <Icon icon={AlignJustify} name={'justify'} />
                </div>
            case 'alignment-items':
                return <div style={{ gap: '10px', display: 'flex' }}>
                    <Icon rotate={rotation} icon={AlignStartVertical} name={'start'} />
                    <Icon rotate={rotation} icon={AlignCenterVertical} name={'center'} />
                    <Icon rotate={rotation} icon={AlignEndVertical} name={'end'} />
                    <Icon rotate={rotation} icon={StretchVertical} name={'stretch'} />
                </div>
            case 'alignment-flex':
                return <div style={{ gap: '10px', display: 'flex' }}>
                    <Icon icon={ArrowRightFromLine} name={'row'} />
                    <Icon icon={ArrowLeftFromLine} name={'row-reverse'} />
                    <Icon icon={ArrowDownFromLine} name={'column'} />
                    <Icon icon={ArrowUpFromLine} name={'column-reverse'} />
                </div>
            case 'alignment-content':
                return <div style={{ gap: '10px', display: 'flex' }}>
                    <Icon rotate={rotation} icon={AlignVerticalJustifyStart} name={'start'} />
                    <Icon rotate={rotation} icon={AlignVerticalJustifyCenter} name={'center'} />
                    <Icon rotate={rotation} icon={AlignVerticalJustifyEnd} name={'end'} />
                    <Icon rotate={rotation} icon={AlignVerticalSpaceBetween} name={'space-between'} />
                    <Icon rotate={rotation} icon={AlignVerticalSpaceAround} name={'space-around'} />
                </div>
        }
    }

    return <CustomField label={label} input={getInput()} menuActions={menuActions} />

}