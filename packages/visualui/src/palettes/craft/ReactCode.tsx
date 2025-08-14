import { useNode, useEditor } from "@protocraft/core";
import { Text } from "@my/ui";
import ContentEditable from 'react-contenteditable';

const editable = false

const ReactCode = (props) => {
    let {
        connectors: { connect },
        setProp,
        id
    } = useNode((node) => ({
        selected: node.events.selected,
        custom: node.data.custom,
    }));

    const { actions } = useEditor()

    return (
        <div ref={connect} style={{ minHeight: '30px', padding: "10px" }}>
            {editable && typeof props.codeBlock == 'string'
                ? <Text color="$gray8">
                    <ContentEditable
                        innerRef={connect}
                        html={props.codeBlock.toString()}
                        onKeyDown={e => {
                            //@ts-ignore
                            if (["Backspace", "Delete"].includes(e.code) && e.target?.innerText == "") {
                                actions.delete(id)
                            }
                        }}
                        onChange={(e) => {
                            setProp((prop) => (prop.codeBlock = e.target.value), 500);
                        }}
                    />
                </Text>
                : <Text color="$gray8">{props.codeBlock ?? 'Unknown'}</Text>}

        </div>
    )
}

const ReactCodeSettings = () => {
    return (
        <div>
        </div>
    )
};

ReactCode.craft = {
    props: {},
    related: {
        settings: ReactCodeSettings
    }
}

export default ReactCode