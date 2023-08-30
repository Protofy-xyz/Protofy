import React from "react";
import { useNode } from "@craftjs/core";
import { getStyleConfs, getPropConfs } from "visualui/components/conf";
import UISwitch, { defaultSwitchProps } from 'baseapp/palettes/uikit/Switch'
import { dumpComponentProps } from "../../utils/utils";

const Switch = (props) => {
    let {
        connectors: { connect },
        custom
    } = useNode((node) => ({
        selected: node.events.selected,
        custom: node.data.custom
    }));

    const newProps = { ...props, ...dumpComponentProps(props, custom) }
    return <UISwitch ref={connect} {...newProps}></UISwitch>
}

const SwitchSettings = () => {
    let { actions: { setProp, setCustom }, props, custom } = useNode((node) => ({
        props: node.data.props,
        custom: node.data.custom
    }));

    const combinedProps = {
        ...defaultSwitchProps,
        ...props
    }

    return (
        <div>
            {getStyleConfs(props, setProp, custom, setCustom, true, 'colorScheme', combinedProps.colorScheme)}
            {getPropConfs(props, setProp, custom, setCustom)}
        </div>
    )
};

Switch.craft = {
    related: {
        settings: SwitchSettings
    },
    props: {},
    custom: {
        moduleSpecifier: '"baseapp/palettes/uikit/Switch"',
        defaultImport: "Switch"
    }
}

export default Switch