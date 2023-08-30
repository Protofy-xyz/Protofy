import React from "react";
import { useNode } from "@craftjs/core";
import { getStyleConfs, getPropConfs, Conf } from "visualui/components/conf";
import { getEmptyBoxStyle } from "visualui/utils/utils";
import UIPressable, { defaultPressableProps } from 'baseapp/palettes/uikit/Pressable'
import { dumpComponentProps } from "../../utils/utils";

const Pressable = (props) => {
    let {
        connectors: { connect },
        custom
    } = useNode((node) => ({
        selected: node.events.selected,
        custom: node.data.custom
    }));

    const emptyStyle = getEmptyBoxStyle(props.children)
    const newProps = { ...props, ...dumpComponentProps(props, custom) }
    return <UIPressable
        ref={connect}
		{...newProps}
        style={{
            ...newProps.style,
            ...emptyStyle,
        }}
        onPress={() => console.log("I'm Pressed baby ;)")}
    >
    </UIPressable>
}

const PressableSettings = () => {
    let { actions: { setProp, setCustom }, props, custom } = useNode((node) => ({
        props: node.data.props,
        custom: node.data.custom
    }));

    const combinedProps = {
        ...defaultPressableProps,
        ...props
    }

    return (
        <div>
            <Conf caption={'Color'} type={'color'} prop={'bgColor'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom}/>
            {getStyleConfs(props, setProp, custom, setCustom)}
            {getPropConfs(props, setProp, custom, setCustom)}
        </div>
    )
};

Pressable.craft = {
    related: {
        settings: PressableSettings
    },
    props: {},
    custom: {
        moduleSpecifier: '"baseapp/palettes/uikit/Pressable"',
        defaultImport: "Pressable"
    }
}

export default Pressable