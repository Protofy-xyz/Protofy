import protolibPalette from 'protolib/dist/visualui'

export const palettes = {
    atoms: {
        basic: {
            ...protolibPalette.atoms.basic
        },
        text: {
            ...protolibPalette.atoms.text
        },
        layout: {
            ...protolibPalette.atoms.layout
        },
        external: {
            ...protolibPalette.atoms.external
        },
        miscellany: {
            ...protolibPalette.atoms.miscellany
        },
    },
    molecules: {
        basic: {
            ...protolibPalette.molecules.basic
        },
        pages: {
            ...protolibPalette.molecules.pages
        },
    }
}