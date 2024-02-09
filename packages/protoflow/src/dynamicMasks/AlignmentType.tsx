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

    const nodeFontSize = useTheme('nodeFontSize')

    const dataKey = 'prop-' + field
    const data = nodeData[dataKey]
    const value = data?.value

    const getIconColor = (type) => {
        if (value == type) return 'white'
        else return
    }

    const onSelectAlignment = (val) => {
        setNodeData(node.id, { ...nodeData, [dataKey]: { ...data, key: field, value: val, kind: 'StringLiteral' } })
    }

    const Icon = ({ icon, label }) => {
        return <div title={label} style={{ cursor: 'pointer' }} onClick={() => onSelectAlignment(label)}>
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
                    <Icon icon={AlignStartVertical} label={'start'} />
                    <Icon icon={AlignCenterVertical} label={'center'} />
                    <Icon icon={AlignEndVertical} label={'end'} />
                    <Icon icon={StretchVertical} label={'stretch'} />
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
                    <Icon icon={AlignVerticalJustifyStart} label={'start'} />
                    <Icon icon={AlignVerticalJustifyCenter} label={'center'} />
                    <Icon icon={AlignVerticalJustifyEnd} label={'end'} />
                    <Icon icon={AlignVerticalSpaceBetween} label={'space-between'} />
                    <Icon icon={AlignVerticalSpaceAround} label={'space-around'} />
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