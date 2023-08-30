import React from "react";
import { useNode } from "@craftjs/core";
import { getStyleConfs, getPropConfs } from "visualui/components/conf";
import UICheckbox, { defaultCheckboxProps } from 'baseapp/palettes/uikit/Checkbox'
import { dumpComponentProps } from "../../utils/utils";

const Checkbox = (props) => {
    let {
        connectors: { connect },
        custom
    } = useNode((node) => ({
        selected: node.events.selected,
        custom: node.data.custom
    }));
    const newProps = { ...props, ...dumpComponentProps(props, custom) }
    return (
        <UICheckbox ref={connect} {...newProps}></UICheckbox>
    )
}

const CheckboxSettings = () => {
    let { actions: { setProp, setCustom }, props, custom } = useNode((node) => ({
        props: node.data.props,
        custom: node.data.custom
    }));

    const combinedProps = {
        ...defaultCheckboxProps,
        ...props
    }

    return (
        <div>
            {getStyleConfs(props, setProp, custom, setCustom, true, 'colorScheme', combinedProps.colorScheme)}
            {getPropConfs(props, setProp, custom, setCustom)}
        </div>
    )
};

Checkbox.craft = {
    related: {
        settings: CheckboxSettings
    },
    props: {},
    custom: {
        moduleSpecifier: '"baseapp/palettes/uikit/Checkbox"',
        defaultImport: "Checkbox"
    }
}

export default Checkbox