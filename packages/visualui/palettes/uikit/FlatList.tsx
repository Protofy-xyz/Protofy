import React, { } from "react";
import { useNode } from "@craftjs/core";
import { getStyleConfs, Conf, getPropConfs } from "visualui/components/conf";
import UIFlatList, { defaultFlatListProps } from 'baseapp/palettes/uikit/FlatList'
import { dumpComponentProps } from "../../utils/utils";

const FlatList = (props) => {
    let {
        connectors: { connect },
        custom
    } = useNode((node) => ({
        selected: node.events.selected,
        custom: node.data.custom
    }));
    const newProps = { ...props, ...dumpComponentProps(props, custom) }

    return (
        <UIFlatList ref={connect} {...newProps}></UIFlatList>
    )
}

const FlatListSettings = () => {
    let { actions: { setProp, setCustom }, props, custom } = useNode((node) => ({
        props: node.data.props,
        custom: node.data.custom
    }));

    const combinedProps = {
        ...defaultFlatListProps,
        ...props
    }

    return (
        <div>
            <Conf caption={'Title'} type={'text'} prop={'children'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom}/>
            <Conf caption={'Subtitle'} type={'text'} prop={'subtitle'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom}/>
            <Conf caption={'Date'} type={'text'} prop={'aditional'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom}/>
            <Conf caption={'Items'} type={'number'} prop={'items'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom}/>
            {getStyleConfs(props, setProp, custom, setCustom)}
            {getPropConfs(props, setProp, custom, setCustom)}
        </div>
    )
};

FlatList.craft = {
    related: {
        settings: FlatListSettings
    },
    props: {},
    custom: {
        moduleSpecifier: '"baseapp/palettes/uikit/FlatList"',
        defaultImport: "FlatList"
    }
}

export default FlatList