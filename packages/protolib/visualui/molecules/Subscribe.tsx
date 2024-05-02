import { Element } from "@protocraft/core";

const Subscribe = (atoms) => {
    return <Element is={atoms.basic.Container} alignItems="center" justifyContent="center" gap="$8">
        <Element is={atoms.text.Head3} fontSize="50px">
            Subscribe
        </Element>
        <Element is={atoms.text.Text} textAlign="center">
            Enter your email and be the first to recieve latest news
        </Element>
        <Element is={atoms.layout.HStack} alignItems="center" gap="$2">
            <Element is={atoms.basic.Input} placeholder="Type your email" minWidth={350} f={3}></Element>
            <Element is={atoms.basic.ButtonSimple} f={1} size="$4">
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