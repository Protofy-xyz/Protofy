import React from "react";
import { useNode } from "@craftjs/core";
import { getStyleConfs, Conf, getPropConfs } from "visualui/components/conf";
// import UIBackground, { defaultBackgroundProps } from 'baseapp/palettes/uikit/Background'
import { dumpComponentProps } from "../../utils/utils";

const Text = (props) => {
    let {
        connectors: { connect },
        custom
    } = useNode((node) => ({
        selected: node.events.selected,
        custom: node.data.custom,
    }));
    const newProps = { ...props, ...dumpComponentProps(props, custom) }
    return (
        <div id="editor-container" ref={connect}
            {...newProps}
            style={{fontSize: '20px'}}
        >{props.children}</div>
    )
}


Text.craft = {
    related: {
        // settings: TextSettings
    },
    props: {},
    // custom: {
    //     moduleSpecifier: '"baseapp/palettes/uikit/Background"',
    //     defaultImport: "Background"
    // }
}

export default Text