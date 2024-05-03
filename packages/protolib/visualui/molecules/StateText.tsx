import { Element } from "@protocraft/core";

const StateText = (atoms) => {
    return <Element canvas is={atoms.layout.HStack} justifyContent="center" padding="$4">
        <Element canvas is={atoms.layout.ProtoView}>
            <Element canvas is={atoms.text.Head1}>
                ON
            </Element>
        </Element>
        <Element canvas is={atoms.layout.ProtoView} viewId={"OFF"}>
            <Element canvas is={atoms.text.Head1}>
                OFF
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