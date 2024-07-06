import { Element } from "@protocraft/core";

const FeaturedCategory = (atoms) => {
    return <Element canvas is={atoms.layout.HStack} flexDirection="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="center" gap="$8">
        <Element canvas is={atoms.layout.VStack} alignItems="center" gap="$4" width={400}>
            <Element canvas is={atoms.text.Text}>
                Discover Our Featured Category
            </Element>
            <Element canvas is={atoms.text.Head1} textAlign="center">
                Find What You Need Here!
            </Element>
            <Element canvas is={atoms.text.Text} textAlign="center">
                Discover Our Featured Category
            </Element>
            <Element canvas is={atoms.basic.ButtonSimple}>
                Start the Adventure!
            </Element>
        </Element>
        <Element
            canvas
            is={atoms.basic.Image}
            width={400}
            height={400}
            url="/images/patterns/pattern-1.png"
        >
        </Element>
    </Element>
}

FeaturedCategory.craft = {
    custom: {
        light: "/images/molecules/featured-category-light.png",
        dark: "/images/molecules/featured-category-dark.png"
    },
    displayName: "FeaturedCategory",
}

export default FeaturedCategory;