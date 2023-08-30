import React, { } from "react";
import { useNode } from "@craftjs/core";
import { getStyleConfs, Conf, getPropConfs } from "visualui/components/conf";
import UIImage, { defaultImageProps } from 'baseapp/palettes/uikit/Image'
import { dumpComponentProps } from "../../utils/utils";

const Image = (props) => {
    let {
        connectors: { connect },
        custom
    } = useNode((node) => ({
        selected: node.events.selected,
        custom: node.data.custom
    }));
    const newProps = { ...props, ...dumpComponentProps(props, custom) }
    return (
        <UIImage ref={connect} {...newProps}></UIImage>
    )
}

const ImageSettings = () => {
    let { actions: { setProp, setCustom }, props, custom } = useNode((node) => ({
        props: node.data.props,
        custom: node.data.custom
    }));

    const combinedProps = {
        ...defaultImageProps,
        ...props
    }

    return (
        <div>
            <Conf caption={'URL'} type={'text'} prop={'url'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom} />
            <Conf caption={'Mode'} type={'select'} prop={'resizeMode'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom} params={[
                { value: 'contain', caption: 'Contained' },
                { value: 'stretch', caption: 'Stretched' },
                { value: 'repeat', caption: 'Repeat' },
                { value: 'cover', caption: 'Cover' }
            ]} />
            {getStyleConfs(props, setProp, custom, setCustom)}
            {getPropConfs(props, setProp, custom, setCustom)}
        </div>
    )
};

Image.craft = {
    related: {
        settings: ImageSettings
    },
    props: {},
    custom: {
        moduleSpecifier: '"baseapp/palettes/uikit/Image"',
        defaultImport: "Image"
    }
}

export default Image