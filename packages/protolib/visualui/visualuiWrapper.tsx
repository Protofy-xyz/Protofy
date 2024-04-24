import React from "react";
import { useNode, useEditor } from "@protocraft/core";
import { CopyPlus } from '@tamagui/lucide-icons'
import { H4 } from 'tamagui'
import Center from '../components/Center'
import ContentEditable from 'react-contenteditable';

export const UIWrap = (name, component, importName, icon?, defaultProps?, uiData?, visualUIOnlyFallbackProps?, editableText?) => {
    const cw = getComponentWrapper(importName)
    return cw(component, icon ?? "EyeOff", name, defaultProps, uiData, visualUIOnlyFallbackProps, editableText)
}
export const UIWrapLib = (importName) => {
    const cw = getComponentWrapper(importName)
    return (name, Component, icon = "EyeOff", defaultProps = {}, uiData = {}, visualUIOnlyFallbackProps: any = {}, editableText = false) => {
        return cw(Component, icon, name, defaultProps, uiData, visualUIOnlyFallbackProps, editableText)
    }
}
export const getComponentWrapper = (importName) => (Component, icon, name, defaultProps = {}, uiData = {}, visualUIOnlyFallbackProps: any = {}, editableText = false) => {
    const importInfo = {
        moduleSpecifier: importName,
        namedImports: [{ alias: undefined, name: name }]
        // defaultImport: componentName
    }
    const UiComponent = (props) => {
        let {
            connectors: { connect },
            setProp,
            id
        } = useNode((node) => ({
            selected: node.events.selected,
            custom: node.data.custom,
        }));
        const { actions } = useEditor()

        return <Component ref={connect} {...visualUIOnlyFallbackProps} {...props}>
            {
                editableText && (typeof props.children == 'string' || typeof props.children == 'number')
                    ? <ContentEditable
                        innerRef={connect}
                        html={props.children.toString()}
                        onKeyDown={e => {
                            if (["Backspace", "Delete"].includes(e.code) && e.target?.innerText == "") {
                                actions.delete(id)
                            }
                        }}
                        onChange={(e) => {
                            setProp((prop) => (prop.children = e.target.value), 500);
                        }}
                    />
                    : props.children ? props.children : visualUIOnlyFallbackProps.children
            }
        </Component>
    }

    var defaultRules = {}
    if (editableText) {
        defaultRules = {
            canMoveIn: () => false
        }
    }

    var data = { context: {}, kinds: {}, props: {} }

    Object.keys(defaultProps).forEach(prop => {
        var value = defaultProps[prop].value
        if (defaultProps[prop].kind && value) {
            data.kinds[prop] = defaultProps[prop].kind
            data.context[prop] = value
            data.props[prop] = value
        } else {
            data.props[prop] = defaultProps[prop]
        }
    }, {})

    UiComponent.craft = {
        related: {},
        custom: {
            icon,
            ...importInfo,
            context: data.context,
            kinds: data.kinds,
            ...uiData['custom'],
        },
        props: data.props,
        displayName: name,
        rules: {
            ...defaultRules,
            ...uiData['rules']
        },
    }
    return { [name]: UiComponent }
}

export const getBasicHtmlWrapper = (componentName) => {
    const UiComponent = (props) => {
        let {
            connectors: { connect },
            setProp
        } = useNode((node) => ({
            selected: node.events.selected,
            custom: node.data.custom,
        }));
        return React.createElement(componentName, { ...props, ref: connect })
    }

    UiComponent.craft = {
        custom: {
            hidden: true
        },
        displayName: componentName,
    }
    return { [componentName]: UiComponent }
}

export const BasicPlaceHolder = ({ text = 'Drag your content here' }) => <Center>
    <CopyPlus opacity={0.2} size="$7" />
    <H4 opacity={0.2}>{text}</H4>
</Center>
