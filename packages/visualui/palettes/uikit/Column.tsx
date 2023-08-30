import React from "react";
import { useNode } from "@craftjs/core";
import { getStyleConfs, Conf, getPropConfs } from "visualui/components/conf";
import { getEmptyBoxStyle } from "visualui/utils/utils";
import UIColumn, { defaultColumnProps } from 'baseapp/palettes/uikit/Column'
import { dumpComponentProps } from "../../utils/utils";

const Column = (props) => {
    let {
        connectors: { connect },
        custom
    } = useNode((node) => ({
        selected: node.events.selected,
        custom: node.data.custom
    }));

    const emptyStyle = getEmptyBoxStyle(props.children)
    const newProps = { ...props, ...dumpComponentProps(props, custom) }

    return <UIColumn
        ref={connect}
        {...newProps}
        style={{
            ...newProps.style,
            ...emptyStyle,
        }}>
    </UIColumn >
}

const ColumnSettings = () => {
    let { actions: { setProp, setCustom }, props, custom } = useNode((node) => ({
        props: node.data.props,
        custom: node.data.custom
    }));

    const combinedProps = {
        ...defaultColumnProps,
        ...props
    }
    return (
        <div>
            <Conf caption={'Color'} type={'color'} prop={'bgColor'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom}/>
            {getStyleConfs(props, setProp, custom, setCustom)}
            {getPropConfs(props, setProp, custom, setCustom)}
        </div>
    )
};

Column.craft = {
    related: {
        settings: ColumnSettings
    },
    props: {},
    custom: {
        moduleSpecifier: '"baseapp/palettes/uikit/Column"',
        defaultImport: "Column"
    }
}

export default Column