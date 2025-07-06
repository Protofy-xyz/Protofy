import { Element } from "@protocraft/core";

const StateText = (atoms) => {
    return <Element canvas is={atoms.layout.HStack} justifyContent="center" padding="$4">
        <Element canvas is={atoms.layout.ProtoView}>
            <Element canvas is={atoms.text.Head1}>
                Default view
            </Element>
        </Element>
        <Element canvas is={atoms.layout.ProtoView} viewId={"view1"}>
            <Element canvas is={atoms.text.Head1}>
                Custom view 1
            </Element>
        </Element>
    </Element>
}

StateText.craft = {
    custom: {
        light: "/images/molecules/statetext-light.png",
        dark: "/images/molecules/statetext-dark.png"
    },
    displayName: "StateText",
}

export default StateText;