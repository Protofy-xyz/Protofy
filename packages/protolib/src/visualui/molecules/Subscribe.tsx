import { Element } from "@protocraft/core";

const Subscribe = (atoms) => {
    return <Element canvas is={atoms.basic.Container} alignItems="center" justifyContent="center" gap="$8" padding="$6">
        <Element canvas is={atoms.text.Head3} fontSize="50px">
            Subscribe
        </Element>
        <Element canvas is={atoms.text.Text} textAlign="center">
            Enter your email and be the first to recieve latest news
        </Element>
        <Element canvas is={atoms.layout.HStack} alignItems="center" gap="$2">
            <Element canvas is={atoms.basic.Input} state="cs.email" placeholder="Type your email" minWidth={350} flex={3}></Element>
            <Element canvas is={atoms.basic.ButtonSimple} flex={1} size="$4">
                subscribe
            </Element>
        </Element>
    </Element>
}

Subscribe.craft = {
    custom: {
        light: "/images/molecules/subscribe-light.png",
        dark: "/images/molecules/subscribe-dark.png"
    },
    displayName: "Subscribe",
}

export default Subscribe;