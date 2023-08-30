import React from "react";
import { useNode } from "@craftjs/core";
import { getStyleConfs, Conf, getPropConfs } from "visualui/components/conf";
import { useThemeStore } from "visualui/store/ThemeStore";
import { themeTranslations } from 'visualui/utils/translations'
import UIInput, { defaultInputProps } from 'baseapp/palettes/uikit/Input'
import { dumpComponentProps } from "../../utils/utils";

const Input = (props) => {
    let {
        connectors: { connect },
        custom
    } = useNode((node) => ({
        selected: node.events.selected,
        custom: node.data.custom
    }));
    const newProps = { ...props, ...dumpComponentProps(props, custom) }

    return (
        <UIInput ref={connect} {...newProps}></UIInput>
    )
}

const InputSettings = () => {
    const theme = useThemeStore(state => state.theme)
    let { actions: { setProp, setCustom }, props, custom } = useNode((node) => ({
        props: node.data.props,
        custom: node.data.custom
    }));

    const visibleFontSizes = theme.protofy?.visibleFontSizes
    const themeFontSizes = !visibleFontSizes ? Object.keys(theme.fontSizes) : Object.keys(theme.fontSizes).filter(key => visibleFontSizes.includes(key))
    const sizesObj = themeFontSizes.reverse().map((key) => {
        return { value: key, caption: themeTranslations[key] ?? key }
    })

    const combinedProps = {
        ...defaultInputProps,
        ...props
    }

    return (
        <div>
            <Conf caption={'Placeholder'} type={'text'} prop={'placeholder'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom} />
            <Conf caption={'Mode'} type={'select'} prop={'variant'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom} params={[
                { value: 'underlined', caption: 'Underlined' },
                { value: 'outline', caption: 'Outline' },
                { value: 'filled', caption: 'Filled' },
                { value: 'round', caption: 'Round' },
                { value: 'unstyled', caption: 'Unstyled' }
            ]} />
            <Conf caption={'Color'} type={'color'} prop={'color'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom} />
            <Conf caption={'Font Size'} type={'select'} prop={'fontSize'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom} params={sizesObj} />
            {getStyleConfs(props, setProp, custom, setCustom)}
            {getPropConfs(props, setProp, custom, setCustom)}
        </div>
    )
};

Input.craft = {
    related: {
        settings: InputSettings
    },
    props: {},
    custom: {
        moduleSpecifier: '"baseapp/palettes/uikit/Input"',
        defaultImport: "Input"
    }
}

export default Input