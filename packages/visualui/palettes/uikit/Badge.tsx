import React from "react";
import { useNode } from "@craftjs/core";
import { getStyleConfs, getPropConfs, Conf } from "visualui/components/conf";
import UIBadge, { defaultBadgeProps } from 'baseapp/palettes/uikit/Badge'
import { dumpComponentProps } from "../../utils/utils";

const Badge = (props) => {
    let {
        connectors: { connect },
        custom
    } = useNode((node) => ({
        selected: node.events.selected,
        custom: node.data.custom 
    }));
    const newProps = { ...props, ...dumpComponentProps(props, custom) }
    return (
            <UIBadge ref={connect} {...newProps}></UIBadge>
    )
}

const BadgeSettings = () => {
    useNode((node) => node);
    let { actions: { setProp, setCustom }, props, custom } = useNode((node) => ({
        props: node.data.props,
        custom: node.data.custom
    }));

    const combinedProps = {
        ...defaultBadgeProps,
        ...props
    }

    return (
        <div>
            <Conf caption={'Caption'} type={'text'} prop={'children'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom}/>
            <Conf caption={'Mode'} type={'select'} prop={'variant'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom} params={[
                { value: 'solid', caption: 'Solid' },
                { value: 'subtle', caption: 'Subtle' },
                { value: 'outline', caption: 'Outline' }
            ]} />
            {getStyleConfs(props, setProp, custom, setCustom, true, 'colorScheme', combinedProps.colorScheme)}
            {getPropConfs(props, setProp, custom, setCustom)}
        </div>
    )
};

Badge.craft = {
    related: {
        settings: BadgeSettings
    },
    props: {},  
    custom: {
        moduleSpecifier: '"baseapp/palettes/uikit/Badge"',
        defaultImport: "Badge"
    }
}

export default Badge