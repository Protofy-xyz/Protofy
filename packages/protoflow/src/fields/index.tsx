import React, { useContext } from "react";
import useTheme from "../diagram/Theme";
import Text from '../diagram/NodeText'
import AlignmentType, { getAlignmentTypes } from "./AlignmentFields";
import ColorType, { getColorTypes } from "./ColorFields";
import RangeType, { getRangeTypes } from "./RangeFields";
import ToggleFields, { getToggleTypes } from "./ToggleFields";
import InputFields, { getInputTypes } from "./InputFields";
import SelectFields, { getSelectTypes } from "./SelectFields";
import { Popover, XStack } from "@my/ui";
import { MoreVertical, RotateCcw } from "lucide-react";
import { FlowStoreContext } from "../store/FlowsStore";

export const getCustomFields = (data) => {
    const rawData = data.find(i => i.type == 'custom-field')?.data ?? []
    const maskCustomFields = rawData.map(i => i.field)

    return [...maskCustomFields]
}

export const getAllFieldTypes = () => {
    const alignmentTypes = getAlignmentTypes()
    const colorTypes = getColorTypes()
    const rangeTypes = getRangeTypes()
    const toggleTypes = getToggleTypes()
    const inputTypes = getInputTypes()
    const selectTypes = getSelectTypes()

    return [...alignmentTypes, ...colorTypes, ...rangeTypes, ...toggleTypes, ...inputTypes, ...selectTypes]
}

export const CustomFieldType = ({ item, node, nodeData }) => {
    const useFlowsStore = useContext(FlowStoreContext)
    const deletePropNodeData = useFlowsStore(state => state.deletePropNodeData)

    var itemData = {
        ...item,
        menuActions: [
            {
                text: "Default Value",
                icon: RotateCcw,
                action: () => { deletePropNodeData(node.id, item.field) },
                // isVisible: (data) => true
            }
        ]
    }

    if (nodeData[item.field]?.kind == "Identifier") {
        itemData['type'] = "input"
    }

    var type = itemData.type ?? ''
    var category = type.split('-')[0]
    switch (category) {
        case 'alignment':
            return <AlignmentType node={node} item={itemData} nodeData={nodeData} />

        case 'color':
            return <ColorType node={node} item={itemData} nodeData={nodeData} />

        case 'range':
            return <RangeType node={node} item={itemData} nodeData={nodeData} />

        case 'toggle':
            return <ToggleFields node={node} item={itemData} nodeData={nodeData} />

        case 'select':
            return <SelectFields node={node} item={itemData} nodeData={nodeData} />

        case 'input':
            return <InputFields node={node} item={itemData} nodeData={nodeData} />

        default:
            return <></>
    }
}

export const CustomField = ({ label, input, menuActions = undefined }: any) => {
    const nodeFontSize = useTheme('nodeFontSize')
    const [menuOpened, setMenuOpened] = React.useState(false)

    return <div style={{ alignItems: 'stretch', flexBasis: 'auto', flexShrink: 0, listStyle: 'none', position: 'relative', display: 'flex', flexDirection: "column" }}>
        <div style={{ fontSize: nodeFontSize + 'px', padding: '8px 15px 8px 15px', display: 'flex', flexDirection: 'row', alignItems: 'stretch' }}>
            <div className={"handleKey"} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flex: 2 }}>
                <Text width="100%">{label}</Text>
            </div>
            <div className={"handleValue"} style={{ minWidth: '180px', marginRight: '10px', display: 'flex', flexDirection: 'row', alignItems: 'center', flex: 3 }}>
                {input}
            </div>
            {
                menuActions
                    ? <Popover onOpenChange={setMenuOpened} open={menuOpened} placement="left">
                        <Popover.Trigger>
                            <div
                                onClick={() => setMenuOpened(true)}
                                style={{ padding: '4px', justifyContent: 'center', cursor: 'pointer', position: 'absolute', right: 0, alignSelf: 'center', zIndex: 10 }}
                            >
                                <MoreVertical size={16} color={useTheme('textColor')} />
                            </div>
                        </Popover.Trigger>
                        <Popover.Content padding={0} space={0} shadowRadius={"$4"} shadowColor={"black"} shadowOpacity={0.6} bc={useTheme('nodeBackgroundColor')} >
                            {menuActions.map((action, i) => {
                                return <XStack
                                    key={i} gap="$2" ml={"$1"} o={1}
                                    br={"$5"} ai="center" p={"$3"}
                                    als="flex-start"
                                    cursor={'pointer'}
                                    onPress={(e) => {
                                        action.action()
                                        setMenuOpened(false)
                                    }}
                                    hoverStyle={{
                                        backgroundColor: useTheme('interactiveColor')
                                    }}
                                >
                                    {React.createElement(action.icon, { size: "16px", strokeWidth: 2 })}
                                    <Text style={{ fontSize: '16px',  fontFamily: 'Jost-Medium' }} >{action.text}</Text>
                                </XStack>
                            })}
                        </Popover.Content>
                    </Popover>
                    : <></>
            }
        </div>
    </div>
}