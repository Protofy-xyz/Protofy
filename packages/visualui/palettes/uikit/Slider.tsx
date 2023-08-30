import React from "react";
import { useNode } from "@craftjs/core";
import { getStyleConfs, getPropConfs, Conf } from "visualui/components/conf";
import UISlider, { defaultSliderProps } from 'baseapp/palettes/uikit/Slider'
import { dumpComponentProps } from "../../utils/utils";

const Slider = (props) => {
    let {
        connectors: { connect },
        custom
    } = useNode((node) => ({
        selected: node.events.selected,
        custom: node.data.custom
    }));
    const newProps = { ...props, ...dumpComponentProps(props, custom) }

    return <UISlider ref={connect} {...newProps}></UISlider>
}

const SliderSettings = () => {
    let { actions: { setProp, setCustom }, props, custom } = useNode((node) => ({
        props: node.data.props,
        custom: node.data.custom, //NEW
    }));

    const combinedProps = {
        ...defaultSliderProps,
        ...props
    }

    return (
        <div>
            <Conf caption={'Default Value'} type={'number'} prop={'defaultValue'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom}/>
            <Conf caption={'Min Value'} type={'number'} prop={'minValue'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom}/>
            <Conf caption={'Max Value'} type={'number'} prop={'maxValue'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom}/>
            <Conf caption={'Step'} type={'number'} prop={'step'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom}/>
            {getStyleConfs(props, setProp, custom, setCustom, true, 'colorScheme', combinedProps.colorScheme)}
            {getPropConfs(props, setProp, custom, setCustom)}
        </div>
    )
};

Slider.craft = {
    related: {
        settings: SliderSettings
    },
    props: {},
    custom: {
        moduleSpecifier: '"baseapp/palettes/uikit/Slider"',
        defaultImport: "Slider"
    }
}

export default Slider