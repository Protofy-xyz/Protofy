import React from "react";
import { useNode } from "@craftjs/core";
import { dumpComponentProps } from "../../utils/utils";

const Page = (props) => {
    let {
        connectors: { connect },
        custom
    } = useNode((node) => ({
        selected: node.events.selected,
        custom: node.data.custom,
    }));
    const newProps = { ...props, ...dumpComponentProps(props, custom) }
    return (
        <div id="editor-container" 
            ref={connect}
            {...newProps}
            style={{ display: 'flex', height: '100%', ...newProps.style }}
        ></div>
    )
}

const ContainerSettings = () => {
    useNode((node) => ({
        props: node.data.props,
        custom: node.data.custom
    }));

    return (
        <div>
        </div>
    )
};

Page.craft = {
    related: {
        settings: ContainerSettings
    },
    props: {},
    custom: {
        moduleSpecifier: '"protoweb"',
        namedImports: [{name: "Page", alias: undefined}]
    },
    rules: {
        canDrag: () => false
    }
}

export default Page