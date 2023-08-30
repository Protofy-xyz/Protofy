import React from "react";
import { useNode } from "@craftjs/core";
import { getStyleConfs, Conf, getPropConfs } from "visualui/components/conf";
import UIDivider, {defaultDividerProps} from 'baseapp/palettes/uikit/Divider'
import { dumpComponentProps } from "../../utils/utils";

const Divider = (props) => {
    let {
        connectors: { connect },
        custom
    } = useNode((node) => ({
        selected: node.events.selected,
        custom: node.data.custom
    }));
    const newProps = { ...props, ...dumpComponentProps(props, custom) }
    return (
        <UIDivider ref={connect} {...newProps} ></UIDivider>
    )
}

const DividerSettings = () => {
    let { actions: { setProp, setCustom }, props, custom } = useNode((node) => ({
        props: node.data.props,
        custom: node.data.custom
    }));

    const combinedProps = {
        ...defaultDividerProps,
        ...props
    }

    return (
        <div>
            <Conf caption={'Mode'} type={'select'} prop={'orientation'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom} params={[
                { value: 'horizontal', caption: 'Horizontal' },
                { value: 'vertical', caption: 'Vertical' }
            ]} />
            <Conf caption={'Length'} type={'text'} prop={'width'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom}/>
            <Conf caption={'Thickness'} type={'text'} prop={'height'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom}/>
            <Conf caption={'Separation'} type={'text'} prop={'separation'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom}/>
            <Conf caption={'Color'} type={'color'} prop={'bgColor'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom}/>
            {getStyleConfs(props, setProp, custom, setCustom)}
            {getPropConfs(props, setProp, custom, setCustom)}
        </div>
    )
};

Divider.craft = {
    related: {
        settings: DividerSettings
    },
    props:{},
    custom: {
        moduleSpecifier: '"baseapp/palettes/uikit/Divider"',
        defaultImport: "Divider"
    }
}

export default Divider