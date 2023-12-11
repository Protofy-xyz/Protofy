import { useNode } from '@craftjs/core';

const Unknown = (props) => {
    let {
        connectors: { connect },
        setProp
    } = useNode((node) => ({
        selected: node.events.selected,
        custom: node.data.custom,
    }));
    return (
        <div ref={connect} style={{minHeight: '30px'}}>
            {props.children ?? 'Unknown'}
        </div>
    )
}

const UnknownSettings = () => {
    return (
        <div>
        </div>
    )
};

Unknown.craft = {
    props: {},
    related: {
        settings: UnknownSettings
    }
}

export default Unknown