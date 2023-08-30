import React from "react";
import { useNode } from "@craftjs/core";
import { getStyleConfs, Conf, getPropConfs } from "visualui/components/conf";
import UIBackground, { defaultBackgroundProps } from 'baseapp/palettes/uikit/Background'
import { dumpComponentProps } from "../../utils/utils";

const Background = (props) => {
    let {
        connectors: { connect },
        custom
    } = useNode((node) => ({
        selected: node.events.selected,
        custom: node.data.custom,
    }));
    const newProps = { ...props, ...dumpComponentProps(props, custom) }
    return (
        <UIBackground ref={connect}
            {...newProps}
        ></UIBackground>
    )
}

const ContainerSettings = () => {
    let { actions: { setProp, setCustom }, props, custom } = useNode((node) => ({
        props: node.data.props,
        custom: node.data.custom
    }));

    const combinedProps = {
        ...defaultBackgroundProps,
        ...props
    }

    return (
        <div>
            <Conf caption={'Mode'} type={'select'} prop={'flexDir'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom} params={[
                { value: 'column', caption: 'Column' },
                { value: 'row', caption: 'Row' }
            ]} />
            <Conf caption={'Color'} type={'color'} prop={'bgColor'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom} />
            {getPropConfs(props, setProp, custom, setCustom)}
            {getStyleConfs(props, setProp, custom, setCustom)}
        </div>
    )
};

Background.craft = {
    related: {
        settings: ContainerSettings
    },
    props: {},
    custom: {
        moduleSpecifier: '"baseapp/palettes/uikit/Background"',
        defaultImport: "Background"
    },
    rules: {
        canDrag: () => false
    }
}

export default Background