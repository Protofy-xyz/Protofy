import { Element } from "@protocraft/core";

const ProductColumns = (atoms) => {
    return <Element is={atoms.layout.Section} justifyContent="center" gap="$4" margin="$4">
        <Element is={atoms.text.Text} color="$color8" fontSize="40px">
            Discover Our Featured Services
        </Element>
        <Element is={atoms.layout.HStack} gap="$6" flexWrap='wrap'>
            <Element is={atoms.layout.VStack} gap="$4" width={300} justifyContent='flex-start'>
                <Element
                    is={atoms.basic.Image}
                    width={300}
                    height={350}
                    url="/images/patterns/pattern-1.png"
                >
                </Element>
                <Element is={atoms.text.Text} color="$color8" fontWeight="bold" padding="$0" alignSelf="flex-start">
                    Custom Web Design
                </Element>
                <Element is={atoms.text.Text} >
                    Make Your Online Presence Shine with a Unique Website
                </Element>
                <Element is={atoms.basic.ButtonSimple}>
                    Learn More
                </Element>
            </Element>
            <Element is={atoms.layout.VStack} gap="$4" width={300} justifyContent='flex-start'>
                <Element
                    is={atoms.basic.Image}
                    width={300}
                    height={350}
                    url="/images/patterns/pattern-1.png"
                >
                </Element>
                <Element is={atoms.text.Text} color="$color8" fontWeight="bold" padding="$0" alignSelf="flex-start">
                    Custom Web Design
                </Element>
                <Element is={atoms.text.Text} >
                    Make Your Online Presence Shine with a Unique Website
                </Element>
                <Element is={atoms.basic.ButtonSimple}>
                    Learn More
                </Element>
            </Element>
            <Element is={atoms.layout.VStack} gap="$4" width={300} justifyContent='flex-start'>
                <Element
                    is={atoms.basic.Image}
                    width={300}
                    height={350}
                    url="/images/patterns/pattern-1.png"
                >
                </Element>
                <Element is={atoms.text.Text} color="$color8" fontWeight="bold" padding="$0" alignSelf="flex-start">
                    Custom Web Design
                </Element>
                <Element is={atoms.text.Text} >
                    Make Your Online Presence Shine with a Unique Website
                </Element>
                <Element is={atoms.basic.ButtonSimple}>
                    Learn More
                </Element>
            </Element>
        </Element>
    </Element>
}

ProductColumns.craft = {
    custom: {
        molecule: true,
        icon: "LayoutTemplate"
    },
    displayName: "ProductColumns",
}

export default ProductColumns;