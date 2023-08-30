import React from "react";
import { useNode } from "@craftjs/core";
import { getStyleConfs, getPropConfs, Conf } from "visualui/components/conf";
import UIAlert, { defaultAlertProps } from 'baseapp/palettes/uikit/Alert'
import { dumpComponentProps } from "../../utils/utils";

const Alert = (props) => {
    let {
        connectors: { connect },
        custom
    } = useNode((node) => ({
        selected: node.events.selected,
        custom: node.data.custom
    }));
    const newProps = { ...props, ...dumpComponentProps(props, custom) } 
    return (
        <UIAlert ref={connect} {...newProps}></UIAlert>
    )
}

const AlertSettings = () => {
    let { actions: { setProp, setCustom }, props, custom } = useNode((node) => ({
        props: node.data.props,
        custom: node.data.custom
    }));

    const combinedProps = {
        ...defaultAlertProps,
        ...props
    }

    return (
        <div>
            <Conf caption={'Title'} type={'text'} prop={'children'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom} />
            <Conf caption={'Status'} type={'select'} prop={'status'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom} params={[
                { value: 'success', caption: 'Success' },
                { value: 'error', caption: 'Error' },
                { value: 'info', caption: 'Info' },
                { value: 'warning', caption: 'Warning' },
            ]} />
            <Conf caption={'Variant'} type={'select'} prop={'variant'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom} params={[
                { value: 'subtle', caption: 'Subtle' },
                { value: 'solid', caption: 'Solid' },
                { value: 'top-accent', caption: 'Top Accent' },
                { value: 'left-accent', caption: 'Left Accent' },
                { value: 'outline-light', caption: 'Outline Light' },
                { value: 'outline', caption: 'Outline' },
            ]} />
            {getStyleConfs(props, setProp, custom, setCustom)}
            {getPropConfs(props, setProp, custom, setCustom)}
        </div>
    )
};

Alert.craft = {
    related: {
        settings: AlertSettings
    },
    props: {},
    custom: {
        moduleSpecifier: '"baseapp/palettes/uikit/Alert"',
        defaultImport: "Alert"
    }
}

export default Alert