import React from "react";
import { useNode } from "@craftjs/core";
import { getStyleConfs, Conf, getPropConfs } from "visualui/components/conf";
import UIDialog, { defaultDialogProps } from 'baseapp/palettes/uikit/Dialog'
import { dumpComponentProps } from "../../utils/utils";

const Dialog = (props) => {
    let {
        connectors: { connect },
        custom
    } = useNode((node) => ({
        selected: node.events.selected,
        custom: node.data.custom
    }));
    const newProps = { ...props, ...dumpComponentProps(props, custom) }
    
    return (
        <UIDialog ref={connect} {...newProps}></UIDialog>
    )
}

const DialogSettings = () => {
    let { actions: { setProp, setCustom }, props, custom } = useNode((node) => ({
        props: node.data.props,
        custom: node.data.custom
    }));

    const combinedProps = {
        ...defaultDialogProps,
        ...props
    }

    return (
        <div>
            <Conf caption={'Header'} type={'text'} prop={'header'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom}/>
            <Conf caption={'Body'} type={'text'} prop={'body'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom}/>
            <Conf caption={'Button Title'} type={'text'} prop={'children'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom}/>
            {getStyleConfs(props, setProp, custom, setCustom, true, 'colorScheme', combinedProps.colorScheme)}
            {getPropConfs(props, setProp, custom, setCustom)}
        </div>
    )
};

Dialog.craft = {
    related: {
        settings: DialogSettings
    },
    props: {},
    custom: {
        moduleSpecifier: '"baseapp/palettes/uikit/Dialog"',
        defaultImport: "Dialog"
    }
}

export default Dialog