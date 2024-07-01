export const LayoutProps = [
    {
        "label": "margin",
        "field": "prop-margin",
        "staticLabel": true,
        "type": "range-theme",
        "section": "layout"
    },
    {
        "label": "padding",
        "field": "prop-padding",
        "staticLabel": true,
        "type": "range-theme",
        "section": "layout"
    },
    {
        "label": "alignSelf",
        "field": "prop-alignSelf",
        "staticLabel": true,
        "type": "alignment-items",
        "section": "layout"
    },
    {
        "label": "textAlign",
        "field": "prop-textAlign",
        "staticLabel": true,
        "type": "alignment-text",
        "section": "layout"
    }
]

export const DecorationProps = [
    {
        "label": "circular",
        "field": "prop-circular",
        "staticLabel": true,
        "type": "toggle-boolean",
        "section": "decoration"
    },
    {
        "label": "chromeless",
        "field": "prop-chromeless",
        "staticLabel": true,
        "type": "toggle-boolean",
        "section": "decoration"
    },
    {
        "label": "themeInverse",
        "field": "prop-themeInverse",
        "staticLabel": true,
        "type": "toggle-boolean",
        "section": "decoration"
    },
    {
        "label": "borderRadius",
        "field": "prop-borderRadius",
        "staticLabel": true,
        "type": "range-theme",
        "section": "decoration"
    }
]
export const DimensionProps = [
    {
        "label": "width",
        "field": "prop-width",
        "staticLabel": true,
        "type": "input",
        "section": "dimensions"
    },
    {
        "label": "height",
        "field": "prop-height",
        "staticLabel": true,
        "type": "input",
        "section": "dimensions"
    }
]

export const TextProps = [
    {
        "label": "color",
        "field": "prop-color",
        "type": "color",
        "staticLabel": true,
        "section": "text"
    },
    {
        "label": "fontSize",
        "field": "prop-fontSize",
        "staticLabel": true,
        "type": "input",
        "section": "text"
    },
    {
        "label": "fontStyle",
        "field": "prop-fontStyle",
        "staticLabel": true,
        "type": "select",
        "data": [
            "normal",
            "italic"
        ],
        "section": "text"
    },
    {
        "label": "fontWeight",
        "field": "prop-fontWeight",
        "staticLabel": true,
        "type": "select",
        "data": [
            "100",
            "200",
            "300",
            "400",
            "500",
            "600",
            "700",
            "800",
            "900",
            "bold",
            "normal"
        ],
        "section": "text"
    },
    {
        "label": "fontFamily",
        "field": "prop-fontFamily",
        "staticLabel": true,
        "type": "select",
        "data": [
            "$body",
            "$cherryBomb",
            "$heading",
            "$headingDmSans",
            "$headingDmSerifDisplay",
            "$mono",
            "$munro",
            "$silkscreen"
        ],
        "section": "text"
    }

]

export const ThemeProps = [
    {
        "label": "theme",
        "field": "prop-theme",
        "staticLabel": true,
        "type": "color-theme",
        "section": "theme"
    },
]