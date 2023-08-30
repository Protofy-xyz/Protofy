import React from "react";
import { useNode } from "@craftjs/core";
import { getStyleConfs, getPropConfs, Conf } from "visualui/components/conf";
import UIRadio, { defaultRadioProps } from 'baseapp/palettes/uikit/Radio'
import { dumpComponentProps } from "../../utils/utils";

const Radio = (props) => {
    let {
        connectors: { connect },
        custom
    } = useNode((node) => ({
        selected: node.events.selected,
        custom: node.data.custom
    }));
    const newProps = { ...props, ...dumpComponentProps(props, custom) } 
    
    return <UIRadio ref={connect} {...newProps}></UIRadio>

}

const RadioSettings = () => {
    let { actions: { setProp, setCustom }, props, custom } = useNode((node) => ({
        props: node.data.props,
        custom: node.data.custom
    }));

    const combinedProps = {
        ...defaultRadioProps,
        ...props
    }

    return (
        <div>
            <Conf caption={'Options'} type={'text'} prop={'options'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom}/>
            {getStyleConfs(props, setProp, custom, setCustom, true, 'colorScheme', combinedProps.colorScheme)}
            {getPropConfs(props, setProp, custom, setCustom)}
        </div>
    )
};

Radio.craft = {
    related: {
        settings: RadioSettings
    },
    props: {},
    custom: {
        moduleSpecifier: '"baseapp/palettes/uikit/Radio"',
        defaultImport: "Radio"
    }
}

export default Radio