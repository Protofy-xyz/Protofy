import React from "react";
import { useNode } from "@craftjs/core";
import { getStyleConfs, Conf, getPropConfs } from "visualui/components/conf";
import UIMenu, { defaultMenuProps } from 'baseapp/palettes/uikit/Menu'
import { dumpComponentProps } from "../../utils/utils";

const Menu = (props) => {
    let {
        connectors: { connect },
        custom
    } = useNode((node) => ({
        selected: node.events.selected,
        custom: node.data.custom 
    }));
    const newProps = { ...props, ...dumpComponentProps(props, custom) } 
    return <UIMenu ref={connect} {...newProps}></UIMenu>

}

const MenuSettings = () => {
    let { actions: { setProp, setCustom }, props, custom } = useNode((node) => ({
        props: node.data.props,
        custom: node.data.custom
    }));

    const combinedProps = {
        ...defaultMenuProps,
        ...props
    }

    return (
        <div>
            <Conf caption={'Options'} type={'text'} prop={'options'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom}/>
            <Conf caption={'Color'} type={'color'} prop={'color'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom}/>
            {getStyleConfs(props, setProp, custom, setCustom)}
            {getPropConfs(props, setProp, custom, setCustom)}
        </div>
    )
};

Menu.craft = {
    related: {
        settings: MenuSettings
    },
    props:{},
    custom: {
        moduleSpecifier: '"baseapp/palettes/uikit/Menu"',
        defaultImport: "Menu"
    }
}

export default Menu