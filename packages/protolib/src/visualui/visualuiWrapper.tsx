import React from "react";
import { useNode } from "@craftjs/core";

export default (importInfo) => (Component, icon, name, defaultProps = {}, componentRules = {}, visualUIOnlyFallbackProps:any = {}) => {
    const UiComponent = (props) => {
        let {
            connectors: { connect },
            custom
        } = useNode((node) => ({
            selected: node.events.selected,
            custom: node.data.custom,
        }));
        return <Component ref={connect} {...visualUIOnlyFallbackProps} {...props}>
            {props.children ? props.children : visualUIOnlyFallbackProps.children}
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
    return {[name]:UiComponent}
}
