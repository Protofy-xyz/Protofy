import React, { useContext, useState } from 'react';
import useTheme from '../diagram/Theme';
import { FlowStoreContext } from '../store/FlowsStore';
import { CustomField } from '.';
import Select from '../diagram/NodeSelect';
import { getDataFromField, getFieldValue } from '../utils';

export const getSelectTypes = () => ['select']

export default ({ nodeData = {}, item, node }) => {
    const useFlowsStore = useContext(FlowStoreContext)
    const setNodeData = useFlowsStore(state => state.setNodeData)

    const { field, label, type, data, menuActions } = item

    const value = getFieldValue(field, nodeData) ?? ""
    const pre = item.pre ? item.pre : (str) => str
    const post = item.post ? item.post : (str) => str

    const options = (data ?? []).map(opt => ({ label: opt, value: opt }))

    const onValueChange = (val) => {
        setNodeData(node.id, { ...nodeData, [field]: getDataFromField(post(val), field, nodeData) })
    }

    const getInput = () => {
        switch (type) {
            case 'select':
            default:
                return <div style={{ width: '100%' }}>
                    <Select
                        onChange={data => onValueChange(data.value)}
                        defaultValue={{
                            value: pre(value),
                            label: value
                        }}
                        options={options} />
                </div>
        }
    }

    return <CustomField label={label} input={getInput()} menuActions={menuActions} />

}