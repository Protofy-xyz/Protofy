import { Element } from "@protocraft/core";

const ProductColumns = (atoms) => {
    return <Element canvas is={atoms.layout.VStack} alignItems="center" justifyContent="center" gap="$4" margin="$4">
        <Element canvas is={atoms.text.Text} fontSize="40px">
            Discover Our Featured Services
        </Element>
        <Element canvas is={atoms.layout.HStack} gap="$6" flexWrap='wrap'>
            <Element canvas is={atoms.layout.VStack} gap="$4" width={300} justifyContent='flex-start'>
                <Element
                    canvas
                    is={atoms.basic.Image}
                    width={300}
                    height={350}
                    url="/images/patterns/pattern-1.png"
                >
                </Element>
                <Element canvas is={atoms.text.Text} fontWeight="bold" padding="$0" alignSelf="flex-start">
                    Custom Web Design
                </Element>
                <Element canvas is={atoms.text.Text} >
                    Make Your Online Presence Shine with a Unique Website
                </Element>
                <Element canvas is={atoms.basic.ButtonSimple}>
                    Learn More
                </Element>
            </Element>
            <Element canvas is={atoms.layout.VStack} gap="$4" width={300} justifyContent='flex-start'>
                <Element
                    canvas
                    is={atoms.basic.Image}
                    width={300}
                    height={350}
                    url="/images/patterns/pattern-2.png"
                >
                </Element>
                <Element canvas is={atoms.text.Text} fontWeight="bold" padding="$0" alignSelf="flex-start">
                    Custom Web Design
                </Element>
                <Element canvas is={atoms.text.Text} >
                    Make Your Online Presence Shine with a Unique Website
                </Element>
                <Element canvas is={atoms.basic.ButtonSimple}>
                    Learn More
                </Element>
            </Element>
            <Element canvas is={atoms.layout.VStack} gap="$4" width={300} justifyContent='flex-start'>
                <Element
                    canvas
                    is={atoms.basic.Image}
                    width={300}
                    height={350}
                    url="/images/patterns/pattern-3.png"
                >
                </Element>
                <Element canvas is={atoms.text.Text} fontWeight="bold" padding="$0" alignSelf="flex-start">
                    Custom Web Design
                </Element>
                <Element canvas is={atoms.text.Text} >
                    Make Your Online Presence Shine with a Unique Website
                </Element>
                <Element canvas is={atoms.basic.ButtonSimple}>
                    Learn More
                </Element>
            </Element>
        </Element>
    </Element>
}

ProductColumns.craft = {
    custom: {
        light: "/images/molecules/product-columns-light.png",
        dark: "/images/molecules/product-columns-dark.png"
    },
    displayName: "ProductColumns",
}

export default ProductColumns;