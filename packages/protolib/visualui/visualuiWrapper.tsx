import React from "react";
import { useNode, useEditor } from "@protocraft/core";
import { CopyPlus } from '@tamagui/lucide-icons'
import { H4 } from '@my/ui'
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
export const UIWrapRelative = (path) => {
    return (Component, icon, name, defaultProps = {}, uiData = {}, visualUIOnlyFallbackProps: any = {}, editableText = false) => {
        const cw = getComponentWrapper(path + "/" + name)
        return cw(Component, icon, name, defaultProps, uiData, visualUIOnlyFallbackProps, editableText)
    }
}

export const getComponentWrapper = (importName) => (Component, icon, name, defaultProps = {}, uiData = {}, visualUIOnlyFallbackProps: any = {}, editableText = false) => {
    const importInfo = {
        moduleSpecifier: importName,
        namedImports: [{ alias: undefined, name: name }]
        // defaultImport: componentName
    }

    return uiComponentWrapper(Component, name, {
        craft: {
            related: {},
            custom: {
                icon,
                ...importInfo,
                context: uiData['custom']?.context || {},
                kinds: uiData['custom']?.kinds || {},
            },
            props: defaultProps,
            displayName: name,
            rules: {
                canMoveIn: () => false,
                ...uiData['rules']
            }
        },
        visualUIOnlyFallbackProps,
        editableText
    })
}

export const uiComponentWrapper = (Component, componentName, options = {}) => {
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

        return <Component ref={connect} {...options["visualUIOnlyFallbackProps"]} {...props}>
            {
                options["editableText"] && (typeof props.children == 'string' || typeof props.children == 'number')
                    ? <ContentEditable
                        innerRef={connect}
                        html={props.children.toString()}
                        onKeyDown={e => {
                            //@ts-ignore
                            if (["Backspace", "Delete"].includes(e.code) && e.target?.innerText == "") {
                                actions.delete(id)
                            }
                        }}
                        onChange={(e) => {
                            setProp((prop) => (prop.children = e.target.value), 500);
                        }}
                    />
                    : props.children ? props.children : options["visualUIOnlyFallbackProps"]?.children
            }
        </Component>
    }

    UiComponent.craft = {
        ...options["craft"],
        displayName: componentName,
    }
    return { [componentName]: UiComponent }
}

export const getBasicHtmlWrapper = (componentName, options: any = {}) => {
    const UiComponent = (props) => {
        let {
            connectors: { connect },
            setProp
        } = useNode((node) => ({
            selected: node.events.selected,
            custom: node.data.custom,
        }));
        return React.createElement(componentName, { ...props, children: props?.children ? props?.children : options["visualUIOnlyFallbackProps"].children, ref: connect })
    }

    UiComponent.craft = {
        ...options["craft"],
        custom: {
            hidden: true,
            ...options["craft"]?.custom,
        },
        displayName: componentName,
    }
    return { [componentName]: UiComponent }
}

export const BasicPlaceHolder = ({ text = 'Drag your content here' }) => <Center>
    <CopyPlus opacity={0.2} size="$7" />
    <H4 opacity={0.2}>{text}</H4>
</Center>
