import React from "react";
import { useNode } from "@craftjs/core";
import { getStyleConfs, Conf, getPropConfs } from "visualui/components/conf";
import UILink, { defaultLinkProps } from 'baseapp/palettes/uikit/Link'
import { dumpComponentProps } from "../../utils/utils";

const Link = (props) => {
    let {
        connectors: { connect },
        custom
    } = useNode((node) => ({
        selected: node.events.selected,
        custom: node.data.custom
    }));

    const newProps = { ...props, ...dumpComponentProps(props, custom) } 
    return (
        <UILink ref={connect} {...newProps}></UILink>
    )
}

const TextSettings = () => {
    let { actions: { setProp, setCustom }, props, custom } = useNode((node) => ({
        props: node.data.props,
        custom: node.data.custom
    }));

    const combinedProps = {
        ...defaultLinkProps,
        ...props
    }

    return (
        <div>
            <Conf caption={'Text'} type={'text'} prop={'children'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom}/>
            <Conf caption={'Link'} type={'text'} prop={'link'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom}/>
            <Conf caption={'Color'} type={'color'} prop={'color'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom}/>
            {getStyleConfs(props, setProp, custom, setCustom)}
            {getPropConfs(props, setProp, custom, setCustom)}
        </div>
    )
};

Link.craft = {
    related: {
        settings: TextSettings
    },
    props: {},
    custom: {
        moduleSpecifier: '"baseapp/palettes/uikit/Link"',
        defaultImport: "Link"
    }
}

export default Link