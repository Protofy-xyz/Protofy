import React from "react";
import { useNode } from "@craftjs/core";
import { getStyleConfs, Conf, getPropConfs } from "visualui/components/conf";
import UIProgress, { defaultProgressProps } from 'baseapp/palettes/uikit/Progress'
import { dumpComponentProps } from "../../utils/utils";

const Progress = (props) => {
    let {
        connectors: { connect },
        custom
    } = useNode((node) => ({
        selected: node.events.selected,
        custom: node.data.custom
    }));
    const newProps = { ...props, ...dumpComponentProps(props, custom) } 
    return <UIProgress ref={connect} {...newProps}></UIProgress>
}

const ProgressSettings = () => {
    let { actions: { setProp, setCustom }, props, custom } = useNode((node) => ({
        props: node.data.props,
        custom: node.data.custom
    }));

    const combinedProps = {
        ...defaultProgressProps,
        ...props
    }

    return (
        <div>
            <Conf caption={'Value'} type={'number'} prop={'value'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom}/>
            {getStyleConfs(props, setProp, custom, setCustom, true, 'colorScheme', combinedProps.colorScheme)}
            {getPropConfs(props, setProp, custom, setCustom)}
        </div>
    )
};

Progress.craft = {
    related: {
        settings: ProgressSettings
    },
    props: {},
    custom: {
        moduleSpecifier: '"baseapp/palettes/uikit/Progress"',
        defaultImport: "Progress"
    }
}

export default Progress