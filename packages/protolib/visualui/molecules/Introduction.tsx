import { Element } from "@protocraft/core";

const Introduction = (atoms) => {
    return <Element is={atoms.basic.Container} alignItems="start" gap="$5" padding="$0">
        <Element is={atoms.text.Head3} textAlign="left" margin="$0" padding="$0" alignSelf="start">
            Protofy is a Full-Stack, batteries included Low-Code enabled web/app and IoT system with an API system and real time messaging.
        </Element>
        <Element is={atoms.basic.ButtonSimple}>
            Learn More
        </Element>
    </Element>
}

Introduction.craft = {
    custom: {
        light: "/images/molecules/introduction-light.png",
        dark: "/images/molecules/introduction-dark.png"
    },
    displayName: "Introduction",
}

export default Introduction;