import React, {forwardRef} from "react";
import { useNode } from "@craftjs/core";
// import { NativeBaseProvider as NBProvider, theme } from 'native-base';

const NativeBaseProvider = forwardRef((props, ref) => {
    const { connectors: { connect, drag }, hasSelectedNode, actions: { setProp } } = useNode((state) => ({
        hasSelectedNode: state.events.selected
    }));

    return <div
        ref={connect(drag(ref))}
        style={{border: "1px solid red", width:"400px", height: "300px"}}
    >
        {props.children}
    </div>
})

const NativeBaseSettings = () => {
    useNode((node) => ({
        props: node.data.props
    }));
    return (
        <div>
        </div>
    )
};

NativeBaseProvider.craft = {
    props: {
    },
    related: {
        settings: NativeBaseSettings
    }
}

export default NativeBaseProvider