import { ChevronDown, ChevronRight, MinusCircle, MinusSquare, MoreHorizontal, MoreVertical, Plus, PlusSquare } from "@tamagui/lucide-icons";
import React from "react";
import { Stack, Text } from "tamagui";

const CollapseIcon = (props) => {
    let { collapsible, toggleNodeCollapsed, isNodeCollapsed } = props;
    if (!collapsible) return null;
    return  (
        <Stack cursor="pointer" onPress={toggleNodeCollapsed} top={6.45} hoverStyle={{opacity: 0.8}} opacity={0.1} display="inline">
            {isNodeCollapsed() ? (
                <Stack top={3} display="inline">
                    <MoreHorizontal size={"$1"} color={"var(--color)"} />
                </Stack>
            ):(
                <ChevronRight size={"$1"} color={"var(--color)"} />
            )}
        </Stack>
    )
};


function toggleNodeCollapsed(marginLeft, key, marginLeftStep) {
    //@ts-node
    //@ts-ignore
    let { collapsedNodes } = this.state;
    let level = marginLeft / marginLeftStep;
    let keys = collapsedNodes[level] || {};

    if (keys[key]) delete keys[key];
    //keys[key] = false ?
    else keys[key] = true;
    collapsedNodes[level] = keys;
    //@ts-node
    //@ts-ignore
    this.setState({ collapsedNodes });
}

function isNodeCollapsed(marginLeft, key, marginLeftStep) {
    //@ts-node
    //@ts-ignore
    let { collapsedNodes } = this.state;
    let level = marginLeft / marginLeftStep;
    if (!collapsedNodes[level]) return false;
    return collapsedNodes[level][key];
}

const MemorizedCollapseIcon = React.memo(CollapseIcon)

export { MemorizedCollapseIcon as CollapseIcon, toggleNodeCollapsed, isNodeCollapsed };