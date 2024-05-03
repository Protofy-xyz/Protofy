import { Element } from "@protocraft/core";

const Buttons = (atoms) => {
    return <Element canvas is={atoms.layout.HStack} gap="$5" justifyContent="center" padding="$4">
        <Element canvas is={atoms.basic.ButtonSimple} size="$6">
            Cancel
        </Element>
        <Element canvas is={atoms.basic.ButtonSimple} size="$6" themeInverse>
            Accept
        </Element>
    </Element>
}

Buttons.craft = {
    custom: {
        light: "/images/molecules/buttons-light.png",
        dark: "/images/molecules/buttons-dark.png"
    },
    displayName: "Buttons",
}

export default Buttons;