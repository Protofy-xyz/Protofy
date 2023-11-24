import React from "react";
import { useNode } from "@craftjs/core";
import { CopyPlus } from '@tamagui/lucide-icons'
import { H4 } from 'tamagui'
import Center from '../components/Center'
import ContentEditable from 'react-contenteditable';

export const getComponentWrapper = (importName) => (Component, icon, name, defaultProps = {}, componentRules = {}, visualUIOnlyFallbackProps: any = {}, editableText = false) => {
    const importInfo = {
        moduleSpecifier: importName,
        namedImports: [{ alias: undefined, name: name }]
        // defaultImport: componentName
    }
    const UiComponent = (props) => {
        let {
            connectors: { connect },
            setProp
        } = useNode((node) => ({
            selected: node.events.selected,
            custom: node.data.custom,
        }));
        return <Component ref={connect} {...visualUIOnlyFallbackProps} {...props}>
            {
                editableText && typeof props.children == 'string'
                    ? <ContentEditable
                        innerRef={connect}
                        html={props.children}
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
    
    UiComponent.craft = {
        related: {
        },
        custom: {
            icon,
            ...importInfo,
        },
        props: defaultProps,
        displayName: name,
        rules: {
            ...defaultRules,
            ...componentRules
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
        return React.createElement(componentName, {...props, ref: connect})
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
