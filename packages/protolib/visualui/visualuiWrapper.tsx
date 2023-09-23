import React from "react";
import { useNode } from "@craftjs/core";
import { CopyPlus } from '@tamagui/lucide-icons'
import { H4 } from 'tamagui'
import Center from '../components/Center'

export const getComponentWrapper = (importName) => (Component, icon, name, defaultProps = {}, componentRules = {}, visualUIOnlyFallbackProps:any = {}) => {
    const importInfo = {
        moduleSpecifier: importName,
        namedImports: [{ alias: undefined }]
        // defaultImport: componentName
      }
    const UiComponent = (props) => {
        let {
            connectors: { connect },
            custom
        } = useNode((node) => ({
            selected: node.events.selected,
            custom: node.data.custom,
        }));
        return <Component ref={connect} {...visualUIOnlyFallbackProps} {...props}>
            {props.children ? props.children : visualUIOnlyFallbackProps.children}
        </Component>
    }
    UiComponent.craft = {
        related: {
        },
        custom: {
            icon,
            ...importInfo,
            namedImports: {
                ...importInfo,
                name: name
            }
        },
        props: defaultProps,
        displayName: name,
        rules: componentRules,
    }
    return {[name]:UiComponent}
}

export const BasicPlaceHolder = ({text='Drag your content here'}) => <Center>
    <CopyPlus opacity={0.2} size="$7" />
    <H4 opacity={0.2}>{text}</H4>
</Center>
