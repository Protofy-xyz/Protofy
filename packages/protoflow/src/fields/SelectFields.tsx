import React, { useContext, useState } from 'react';
import useTheme from '../diagram/Theme';
import { FlowStoreContext } from '../store/FlowsStore';
import { CustomField } from '.';
import Select from '../diagram/NodeSelect';
import { getDataFromField } from '../utils';

export const getSelectTypes = () => ['select']

export default ({ nodeData = {}, item, node }) => {
    const useFlowsStore = useContext(FlowStoreContext)
    const setNodeData = useFlowsStore(state => state.setNodeData)

    const { field, label, type, data, menuActions } = item

    const itemData = nodeData[field]
    const value = itemData?.value

    const options = (data ?? []).map(opt => ({ label: opt, value: opt }))

    const onValueChange = (val) => {
        setNodeData(node.id, { ...nodeData, [field]: getDataFromField(val, field, nodeData) })
    }

    const getInput = () => {
        switch (type) {
            case 'select':
            default:
                return <div style={{ width: '100%' }}>
                    <Select
                        onChange={data => onValueChange(data.value)}
                        defaultValue={{
                            value: value,
                            label: value
                        }}
                        options={options} />
                </div>
        }
    }

    return <CustomField label={label} input={getInput()} menuActions={menuActions} />

}