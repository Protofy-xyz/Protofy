import React, { useContext } from 'react';
import useTheme from '../diagram/Theme';
import Text from '../diagram/NodeText'
import { FlowStoreContext } from '../store/FlowsStore';
import {
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    AlignStartVertical, AlignEndVertical, AlignCenterVertical, StretchVertical,
    ArrowRightFromLine, ArrowLeftFromLine, ArrowDownFromLine, ArrowUpFromLine,
    AlignVerticalJustifyStart, AlignVerticalJustifyCenter, AlignVerticalJustifyEnd, AlignVerticalSpaceAround, AlignVerticalSpaceBetween
} from 'lucide-react';

export const getAlignmentProps = () => [
    "alignSelf", "alignItems", "textAlign", "flexDirection", "justifyContent", "alignContent"
]

export default ({ nodeData = {}, field, node }) => {
    const useFlowsStore = useContext(FlowStoreContext)
    const setNodeData = useFlowsStore(state => state.setNodeData)
    const deletePropNodeData = useFlowsStore(state => state.deletePropNodeData)
    const nodeFontSize = useTheme('nodeFontSize')

    const dataKey = 'prop-' + field
    const data = nodeData[dataKey]
    const value = data?.value
    const rotation = getIconRotation()

    function getIconRotation() {
        let rot = '0deg';
        const isRowDir = Boolean(nodeData["prop-flexDirection"]?.value?.startsWith("row"))
        if(isRowDir) {
            rot = field == 'alignItems' ? '90deg': '-90deg'
        }
        return rot;
    }

    const getIconColor = (type) => {
        if (value == type) return 'white'
        else return
    }

    const onToggleAlignment = (val) => {
        if(value == val) {// deletes nodeData 
            deletePropNodeData(node.id, dataKey)
        }
        else{ // add new prop to nodeData
            setNodeData(node.id, { ...nodeData, [dataKey]: { ...data, key: field, value: val, kind: 'StringLiteral' } })
        }
    }

    const Icon = ({ icon, label, rotate = '0deg'}) => {
        return <div title={label} style={{ cursor: 'pointer', rotate: rotate }} onClick={() => onToggleAlignment(label)}>
            {React.createElement(icon, { color: getIconColor(label) })}
        </div>
    }
    const getInput = () => {
        switch (field) {
            case 'textAlign':
                return <div style={{ gap: '10px', display: 'flex' }}>
                    <Icon icon={AlignLeft} label={'left'} />
                    <Icon icon={AlignCenter} label={'center'} />
                    <Icon icon={AlignRight} label={'right'} />
                    <Icon icon={AlignJustify} label={'justify'} />
                </div>
            case 'alignItems':
            case 'alignSelf':
                return <div style={{ gap: '10px', display: 'flex' }}>
                    <Icon rotate={rotation} icon={AlignStartVertical} label={'start'} />
                    <Icon rotate={rotation} icon={AlignCenterVertical} label={'center'} />
                    <Icon rotate={rotation} icon={AlignEndVertical} label={'end'} />
                    <Icon rotate={rotation} icon={StretchVertical} label={'stretch'} />
                </div>
            case 'flexDirection':
                return <div style={{ gap: '10px', display: 'flex' }}>
                    <Icon icon={ArrowRightFromLine} label={'row'} />
                    <Icon icon={ArrowLeftFromLine} label={'row-reverse'} />
                    <Icon icon={ArrowDownFromLine} label={'column'} />
                    <Icon icon={ArrowUpFromLine} label={'column-reverse'} />
                </div>
            // const justifyContentAlignments = ['"start"', '"center"', '"space-between"', '"space-around"', '"space-evently"']
            case 'justifyContent':
            case 'alignContent':
                return <div style={{ gap: '10px', display: 'flex' }}>
                    <Icon rotate={rotation} icon={AlignVerticalJustifyStart} label={'start'} />
                    <Icon rotate={rotation} icon={AlignVerticalJustifyCenter} label={'center'} />
                    <Icon rotate={rotation} icon={AlignVerticalJustifyEnd} label={'end'} />
                    <Icon rotate={rotation} icon={AlignVerticalSpaceBetween} label={'space-between'} />
                    <Icon rotate={rotation} icon={AlignVerticalSpaceAround} label={'space-around'} />
                </div>


        }
    }

    return <div style={{ alignItems: 'stretch', flexBasis: 'auto', flexShrink: 0, listStyle: 'none', position: 'relative', display: 'flex', flexDirection: "column" }}>
        <div style={{ fontSize: nodeFontSize + 'px', padding: '8px 15px 8px 15px', display: 'flex', flexDirection: 'row', alignItems: 'stretch' }}>
            <div className={"handleKey"} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Text>{field}</Text>
            </div>
            <div className={"handleValue"} style={{ minWidth: '180px', marginRight: '10px', display: 'flex', flexDirection: 'row', flexGrow: 1, alignItems: 'center' }}>
                {getInput()}
            </div>
        </div>
    </div>
}