import { Element } from "@protocraft/core";

const ObjectPropsTable = (atoms) => {
    return <Element canvas is={atoms.layout.VStack} minWidth="400px" borderWidth="$0.25" borderColor="$color9">
        <Element is={atoms.layout.VStack} padding="$3" minWidth="200px" flex={1} borderWidth="$0.25" justifyContent="center" borderColor="$color9">
            <Element is={atoms.text.Text} fontSize={18} color="$color8" fontStyle="italic">
                First
            </Element>
            <Element is={atoms.external.ObjectPropValue} fontSize={18} fontWeight="600"></Element>
        </Element>
        <Element is={atoms.layout.HStack}>
            <Element is={atoms.layout.VStack} padding="$3" minWidth="200px" flex={1} borderWidth="$0.25" justifyContent="center" borderColor="$color9">
                <Element is={atoms.text.Text} fontSize={18} color="$color8" fontStyle="italic">
                    Second
                </Element>
                <Element is={atoms.external.ObjectPropValue} fontSize={18} fontWeight="600"></Element>
            </Element>
            <Element is={atoms.layout.VStack} padding="$3" minWidth="200px" flex={1} borderWidth="$0.25" justifyContent="center" borderColor="$color9">
                <Element is={atoms.text.Text} fontSize={18} color="$color8" fontStyle="italic">
                    Third
                </Element>
                <Element is={atoms.external.ObjectPropValue} fontSize={18} fontWeight="600" object="assemblyline"></Element>
            </Element>
            <Element is={atoms.layout.VStack} padding="$3" minWidth="200px" flex={1} borderWidth="$0.25" justifyContent="center" borderColor="$color9">
                <Element is={atoms.text.Text} fontSize={18} color="$color8" fontStyle="italic">
                    Fourth
                </Element>
                <Element is={atoms.external.ObjectPropValue} fontSize={18} fontWeight="600" object="assemblyline"></Element>
            </Element>
        </Element>
    </Element>
}

ObjectPropsTable.craft = {
    custom: {
        light: "/images/molecules/object-props-table-light.png",
        dark: "/images/molecules/object-props-table-dark.png"
    },
    displayName: "ObjectPropsTable",
}

export default ObjectPropsTable;