import React from "react";
import { useNode } from "@craftjs/core";
import { getStyleConfs, Conf, getPropConfs } from "visualui/components/conf";
import UIFab, {defaultFabProps} from 'baseapp/palettes/uikit/Fab'
import { dumpComponentProps } from "../../utils/utils";

const Fab = (props) => {
    let {
        connectors: { connect },
        custom
    } = useNode((node) => ({
        selected: node.events.selected,
        custom: node.data.custom
    }));
    const newProps = { ...props, ...dumpComponentProps(props, custom) }
    return (
            <UIFab ref={connect} {...newProps} />
    )
}

const FabSettings = () => {
    let { actions: { setProp, setCustom }, props, custom } = useNode((node) => ({
        props: node.data.props,
        custom: node.data.custom
    }));

    const combinedProps = {
		...defaultFabProps,
		...props
	}

    return (
        <div>
            <Conf caption={'Position'} type={'select'} prop={'position'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom} params={[
                { value: 'absolute', caption: 'Absolute' },
                { value: 'relative', caption: 'Relative' }
            ]} style={true} />
            <Conf caption={'Placement'} type={'select'} prop={'placement'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom} params={[
                { value: 'bottom-right', caption: 'Bottom-right' },
                { value: 'top-right', caption: 'Top-right' },
                { value: 'top-left', caption: 'Top-left' },
                { value: 'bottom-left', caption: 'Bottom-left' }
            ]} />
            <Conf caption={'Icon'} type={'text'} prop={'icon'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom}/>
            <Conf caption={'Size'} type={'text'} prop={'size'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom}/>
            {getStyleConfs(props, setProp, custom, setCustom, true, 'colorScheme', combinedProps.colorScheme)}
            {getPropConfs(props, setProp, custom, setCustom)}
        </div>
    )
};

Fab.craft = {
    related: {
        settings: FabSettings
    },
    props: {},
    custom: {
        moduleSpecifier: '"baseapp/palettes/uikit/Fab"',
        defaultImport: "Fab"
    }
}

export default Fab