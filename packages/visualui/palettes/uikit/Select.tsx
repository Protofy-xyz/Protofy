import React from "react";
import { useNode } from "@craftjs/core";
import { getStyleConfs, getPropConfs, Conf } from "visualui/components/conf";
import UISelect, { defaultSelectProps } from 'baseapp/palettes/uikit/Select'
import { dumpComponentProps } from "../../utils/utils";

const Select = (props) => {
    let {
        connectors: { connect },
        custom
    } = useNode((node) => ({
        selected: node.events.selected,
        custom: node.data.custom
    }));
    const newProps = { ...props, ...dumpComponentProps(props, custom) } 
    return <UISelect ref={connect} {...newProps}></UISelect>
}

const SelectSettings = () => {
    let { actions: { setProp, setCustom }, props, custom } = useNode((node) => ({
        props: node.data.props,
        custom: node.data.custom
    }));

    const combinedProps = {
        ...defaultSelectProps,
        ...props
    }

    return (
        <div>
            <Conf caption={'Placeholder'} type={'text'} prop={'placeholder'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom}/>
            <Conf caption={'Mode'} type={'select'} prop={'variant'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom} params={[
                { value: 'underlined', caption: 'Underlined' },
                { value: 'outline', caption: 'Outline' },
                { value: 'filled', caption: 'Filled' },
                { value: 'rounded', caption: 'Rounded' },
                { value: 'unstyled', caption: 'Unstyled' }
            ]} />
            <Conf caption={'Options'} type={'text'} prop={'options'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom}/>
            {getStyleConfs(props, setProp, custom, setCustom)}
            {getPropConfs(props, setProp, custom, setCustom)}
        </div>
    )
};

Select.craft = {
    related: {
        settings: SelectSettings
    },
    props: {},
    custom: {
        moduleSpecifier: '"baseapp/palettes/uikit/Select"',
        defaultImport: "Select"
    }
}

export default Select