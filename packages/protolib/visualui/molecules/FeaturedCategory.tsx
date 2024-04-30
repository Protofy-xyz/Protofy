import { Element } from "@protocraft/core";

const FeaturedCategory = (atoms) => {
    return <Element is={atoms.layout.Section} flexDirection="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="center" gap="$8">
        <Element is={atoms.layout.VStack} alignItems="center" gap="$4" width={400}>
            <Element is={atoms.text.Text}>
                Discover Our Featured Category
            </Element>
            <Element is={atoms.text.Head1} color="$color8" textAlign="center">
                Find What You Need Here!
            </Element>
            <Element is={atoms.text.Text} color="$color11" textAlign="center">
                Discover Our Featured Category
            </Element>
            <Element is={atoms.basic.ButtonSimple}>
                Start the Adventure!
            </Element>
        </Element>
        <Element is={atoms.basic.Image} width={400}>
        </Element>
    </Element>
}

FeaturedCategory.craft = {
    custom: {
        molecule: true,
        icon: "LayoutTemplate"
    },
    displayName: "FeaturedCategory",
}

export default FeaturedCategory;