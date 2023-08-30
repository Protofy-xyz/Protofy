import React from "react";
import { useNode } from "@craftjs/core";
import { getStyleConfs, getPropConfs, Conf } from "visualui/components/conf";
import { useThemeStore } from "visualui/store/ThemeStore";
import { themeTranslations } from 'visualui/utils/translations'
import UITextArea, {defaultTextAreaProps} from 'baseapp/palettes/uikit/TextArea'
import { dumpComponentProps } from "../../utils/utils";

const TextArea = (props) => {
    let {
        connectors: { connect },
        custom
    } = useNode((node) => ({
        selected: node.events.selected,
        custom: node.data.custom
    }));
    const newProps = { ...props, ...dumpComponentProps(props, custom) } 
    return <UITextArea ref={connect} {...newProps}></UITextArea>
}

const TextAreaSettings = () => {
    const theme = useThemeStore(state => state.theme)
    let { actions: { setProp, setCustom }, props, custom } = useNode((node) => ({
        props: node.data.props,
        custom: node.data.custom
    }));
    const visibleFontSizes = theme.protofy?.visibleFontSizes
    const themeFontSizes = !visibleFontSizes ? Object.keys(theme.fontSizes) : Object.keys(theme.fontSizes).filter(key => visibleFontSizes.includes(key))
    const sizesObj = themeFontSizes.reverse().map((key) => {
        return { value: key, caption: themeTranslations[key]?? key }
    })

    const combinedProps = {
		...defaultTextAreaProps,
		...props
	}

    return (
        <div>
            <Conf caption={'Placeholder'} type={'text'} prop={'placeholder'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom}/>
            <Conf caption={'Color'} type={'color'} prop={'color'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom} />
            <Conf caption={'Size'} type={'select'} prop={'size'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom} params={sizesObj} />
            {getStyleConfs(props, setProp, custom, setCustom)}
            {getPropConfs(props, setProp, custom, setCustom)}
        </div>
    )
};

TextArea.craft = {
    related: {
        settings: TextAreaSettings
    },
    props: {},
    custom: {
        moduleSpecifier: '"baseapp/palettes/uikit/TextArea"',
        defaultImport: "TextArea"
    }
}

export default TextArea