import React from "react";
import { useNode } from "@craftjs/core";
import { getStyleConfs, Conf, getPropConfs } from "visualui/components/conf";
import UIButton, { defaultButtonProps } from 'baseapp/palettes/uikit/Button'
import { dumpComponentProps } from "../../utils/utils";

const Button = (props) => {
    let {
        connectors: { connect },
        custom
    } = useNode((node) => ({
        selected: node.events.selected,
        custom: node.data.custom
    }));
    const newProps = { ...props, ...dumpComponentProps(props, custom) }
    // FIXME: can't perform string into Function. Example: onPress="()=>console.log('hello')"
    delete newProps?.onPress 
    return (
        <UIButton ref={connect} {...newProps} ></UIButton>
    )
}

const ButtonSettings = () => {
    let { actions: { setProp, setCustom }, props, custom } = useNode((node) => ({
        props: node.data.props,
        custom: node.data.custom, 
    }));

    const combinedProps = {
        ...defaultButtonProps,
        ...props
    }
    return (
        <div>
            <Conf caption={'Caption'} type={'text'} prop={'children'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom} />
            <Conf caption={'Mode'} type={'select'} prop={'variant'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom} params={[
                { value: 'solid', caption: 'Solid' },
                { value: 'subtle', caption: 'Subtle' },
                { value: 'outline', caption: 'Outline' },
                { value: 'link', caption: 'Link' },
                { value: 'ghost', caption: 'Ghost' },
                { value: 'unstyled', caption: 'Unstyled' }
            ]} />
            <Conf caption={'Disabled'} type={'toggle'} prop={'isDisabled'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom} />
            {getStyleConfs(props, setProp, custom, setCustom, true, 'colorScheme', combinedProps.colorScheme)}
            {getPropConfs(props, setProp, custom, setCustom)}
        </div>
    )
};

Button.craft = {
    related: {
        settings: ButtonSettings
    },
    props: {},
    custom: {
        moduleSpecifier: '"baseapp/palettes/uikit/Button"',
        defaultImport: "Button"
    }
}

export default Button