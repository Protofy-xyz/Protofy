import React from "react";
import { useNode } from "@craftjs/core";
import { getStyleConfs, Conf, getPropConfs } from "visualui/components/conf";
import UIToast, { defaultToastProps } from 'baseapp/palettes/uikit/Toast'
import { dumpComponentProps } from "../../utils/utils";

const Toast = (props) => {
    let {
        connectors: { connect },
        custom
    } = useNode((node) => ({
        selected: node.events.selected,
        custom: node.data.custom
    }));
    const newProps = { ...props, ...dumpComponentProps(props, custom) } 
    return (
        <UIToast ref={connect} {...newProps}></UIToast>
    )
}

const ToastSettings = () => {
    useNode((node) => node);
    let { actions: { setProp, setCustom }, props, custom } = useNode((node) => ({
        props: node.data.props,
        custom: node.data.custom
    }));

    const combinedProps = {
        ...defaultToastProps,
        ...props
    }

    return (
        <div>
            <Conf caption={'Caption'} type={'text'} prop={'children'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom}/>
            <Conf caption={'Mode'} type={'select'} prop={'variant'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom} params={[
                { value: 'solid', caption: 'Solid' },
                { value: 'subtle', caption: 'Subtle' },
                { value: 'outline', caption: 'Outline' },
                { value: 'unstyled', caption: 'Unstyled' }
            ]} />
            <Conf caption={'Placement'} type={'select'} prop={'placement'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom} params={[
                { value: 'bottom', caption: 'Bottom' },
                { value: 'top', caption: 'Top' },
                { value: 'top-left', caption: 'Top left' },
                { value: 'top-right', caption: 'Top right' },
                { value: 'bottom-left', caption: 'Bottom left' },
                { value: 'bottom-right', caption: 'Bottom right' }
            ]} />
            <Conf caption={'Description'} type={'text'} prop={'description'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom}/>
            {getStyleConfs(props, setProp, custom, setCustom, true, 'colorScheme', combinedProps.colorScheme)}
            {getPropConfs(props, setProp, custom, setCustom)}
        </div>
    )
};

Toast.craft = {
    related: {
        settings: ToastSettings
    },
    props: {},
    custom: {
        moduleSpecifier: '"baseapp/palettes/uikit/Toast"',
        defaultImport: "Toast"
    }
}

export default Toast