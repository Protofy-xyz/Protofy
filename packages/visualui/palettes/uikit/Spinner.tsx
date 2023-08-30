import React from "react";
import { useNode } from "@craftjs/core";
import { getStyleConfs, getPropConfs, Conf } from "visualui/components/conf";
import UISpinner, { defaultSpinnerProps } from 'baseapp/palettes/uikit/Spinner'
import { dumpComponentProps } from "../../utils/utils";

const Spinner = (props) => {
    let {
        connectors: { connect },
        custom
    } = useNode((node) => ({
        selected: node.events.selected,
        custom: node.data.custom
    }));

    const newProps = { ...props, ...dumpComponentProps(props, custom) }

    return <UISpinner ref={connect} {...newProps}></UISpinner>
}

const SpinnerSettings = () => {
    let { actions: { setProp, setCustom }, props, custom } = useNode((node) => ({
        props: node.data.props,
        custom: node.data.custom
    }));

    const combinedProps = {
        ...defaultSpinnerProps,
        ...props
    }

    return (
        <div>
            <Conf caption={'Color'} type={'color'} prop={'color'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom}/>
            {getStyleConfs(props, setProp, custom, setCustom)}
            {getPropConfs(props, setProp, custom, setCustom)}
        </div>
    )
};

Spinner.craft = {
    related: {
        settings: SpinnerSettings
    },
    props: {},
    custom: {
        moduleSpecifier: '"baseapp/palettes/uikit/Spinner"',
        defaultImport: "Spinner"
    }
}

export default Spinner