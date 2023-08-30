import React from "react";
import { useNode } from "@craftjs/core";
import { getStyleConfs, getPropConfs, Conf } from "visualui/components/conf";
import { useOpenAIStore } from "visualui/store/OpenAIStore";
import { useThemeStore } from "visualui/store/ThemeStore";
import { themeTranslations } from 'visualui/utils/translations'
import UIText, {defaultTextProps} from 'baseapp/palettes/uikit/Text'
import { dumpComponentProps } from "../../utils/utils";

const Text = (props) => {
    const description = useOpenAIStore(state => state.description)
    let {
        connectors: { connect },
        custom
    } = useNode((node) => ({
        selected: node.events.selected,
        custom: node.data.custom
    }));
    const getEmptyText = () => {
        if (description != '') return description
        else return 'Put your text here'
    }
    const text = props.children
    var _text = (text && text != '') ? text : getEmptyText()

    const newProps = { ...props, ...dumpComponentProps(props, custom) }

    return <UIText ref={connect} {...newProps} >{_text}</UIText>
}

const TextSettings = () => {
    const theme = useThemeStore(state => state.theme)
    let { actions: { setProp, setCustom }, props, custom } = useNode((node) => ({
        props: node.data.props,
        custom: node.data.custom
    }));
    const description = useOpenAIStore(state => state.description)
    const visibleFontSizes = theme.protofy?.visibleFontSizes
    const themeFontSizes = !visibleFontSizes ? Object.keys(theme.fontSizes) : Object.keys(theme.fontSizes).filter(key => visibleFontSizes.includes(key))
    const sizesObj = themeFontSizes.reverse().map((key) => {
        return { value: key, caption: themeTranslations[key]?? key }
    })
    const combinedProps = {
		...defaultTextProps,
		...props
	}

    return (
        <div>
            <Conf caption={'Text'} type={description != '' ? 'textAI' : 'text'} prop={'children'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom} />
            <Conf caption={'Font family'} type={'select'} prop={'fontWeight'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom} params={[
                { value: '200', caption: 'Light' },
                { value: '400', caption: 'Regular' },
                { value: '500', caption: 'Medium' },
                { value: '700', caption: 'Bold' }
            ]} />
            <Conf caption={'Color'} type={'color'} prop={'color'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom}/>
            <Conf caption={'Font Size'} type={'select'} prop={'fontSize'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom} params={sizesObj} />
            {getStyleConfs(props, setProp, custom, setCustom)}
            {getPropConfs(props, setProp, custom, setCustom)}
        </div>
    )
};

Text.craft = {
    related: {
        settings: TextSettings
    },
    props: {},
    custom: {
        moduleSpecifier: '"baseapp/palettes/uikit/Text"',
        defaultImport: "Text"
    }
}

export default Text