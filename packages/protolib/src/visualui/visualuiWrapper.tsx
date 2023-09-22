import React from "react";
import { useNode } from "@craftjs/core";

export default (importInfo) => (Component, icon, name, defaultProps = {}, componentRules = {}) => {
    const UiComponent = (props) => {
        let {
            connectors: { connect },
            custom
        } = useNode((node) => ({
            selected: node.events.selected,
            custom: node.data.custom,
        }));
        return <Component ref={connect} {...props}>
            {props.children}
        </Component>
    }
    UiComponent.craft = {
        related: {
        },
        custom: {
            icon,
            ...importInfo,
            namedImports: {
                ...importInfo,
                name: name
            }
        },
        props: defaultProps,
        displayName: name,
        rules: componentRules,
    }
    return UiComponent
}
