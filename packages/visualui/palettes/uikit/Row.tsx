import React, { } from "react";
import { useNode } from "@craftjs/core";
import { getStyleConfs, getPropConfs, Conf } from "visualui/components/conf";
import UIRow, { defaultRowProps } from 'baseapp/palettes/uikit/Row'
import { getEmptyBoxStyle } from "visualui/utils/utils";
import { dumpComponentProps } from "../../utils/utils";

const Row = (props) => {
    let {
        connectors: { connect },
        custom
    } = useNode((node) => ({
        selected: node.events.selected,
        custom: node.data.custom
    }));
    
    const emptyStyle = getEmptyBoxStyle(props.children)
    const newProps = { ...props, ...dumpComponentProps(props, custom) } 
    
    return <UIRow
        ref={connect}
        {...newProps}
        style={{
            ...newProps.style,
            ...emptyStyle
        }}>
    </UIRow >
}

const RowSettings = () => {
    let { actions: { setProp, setCustom }, props, custom } = useNode((node) => ({
        props: node.data.props,
        custom: node.data.custom
    }));

    const combinedProps = {
        ...defaultRowProps,
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

Row.craft = {
    related: {
        settings: RowSettings
    },
    props: {},
    custom: {
        moduleSpecifier: '"baseapp/palettes/uikit/Row"',
        defaultImport: "Row"
    }
}

export default Row