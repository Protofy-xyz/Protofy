import React from "react";
import { useNode } from "@craftjs/core";
import { getStyleConfs, Conf, getPropConfs } from "visualui/components/conf";
import UIIcon, { defaultIconProps } from 'baseapp/palettes/uikit/Icon'
import { dumpComponentProps } from "../../utils/utils";

const Icon = (props) => {
    let {
        connectors: { connect },
        custom
    } = useNode((node) => ({
        selected: node.events.selected,
        custom: node.data.custom
    }));

    const newProps = { ...props, ...dumpComponentProps(props, custom) }
    return (
        <UIIcon ref={connect} {...newProps}></UIIcon>
    )
}

const IconSettings = () => {
    let { actions: { setProp, setCustom }, props, custom } = useNode((node) => ({
        props: node.data.props,
        custom: node.data.custom
    }));

    const combinedProps = {
        ...defaultIconProps,
        ...props
    }
    return (
        <div>
            <Conf caption={'Library'} type={'select'} prop={'library'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom} params={[
                { value: 'materialCommunityIcons', caption: 'MaterialCommunityIcons' },
                { value: 'antDesign', caption: 'AntDesign' },
                { value: 'entypo', caption: 'Entypo' },
                { value: 'evilIcons', caption: 'EvilIcons' },
                { value: 'feather', caption: 'Feather' },
                { value: 'simpleLineIcons', caption: 'SimpleLineIcons' }
            ]} />
            <Conf caption={'Icon'} type={'text'} prop={'name'} props={combinedProps} setProp={setProp}  custom={custom} setCustom={setCustom}/>
            <Conf caption={'Size'} type={'text'} prop={'size'} props={combinedProps} setProp={setProp}  custom={custom} setCustom={setCustom}/>
            <Conf caption={'Color'} type={'color'} prop={'color'} props={combinedProps} setProp={setProp}  custom={custom} setCustom={setCustom}/>
            {getStyleConfs(props, setProp, custom, setCustom)}
            {getPropConfs(props, setProp, custom, setCustom)}
        </div>
    )
};

Icon.craft = {
    related: {
        settings: IconSettings
    },
    props: {},
    custom: {
        moduleSpecifier: '"baseapp/palettes/uikit/Icon"',
        defaultImport: "Icon"
    }
}

export default Icon