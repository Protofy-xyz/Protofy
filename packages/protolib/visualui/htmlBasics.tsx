import { BasicPlaceHolder, getBasicHtmlWrapper } from './visualuiWrapper'

const htmlElements = {
    "text": ["a", "abbr", "b", "bdi", "bdo", "cite", "code", "data", "dfn", "em", "h1", "h2", "h3", "h4", "h5", "h6", "i", "ins", "kbd", "mark", "q", "rp", "rt", "ruby", "s", "samp", "small", "span", "strong", "sub", "sup", "time", "u", "var", "wbr"],
    "container": ["address", "article", "aside", "blockquote", "body", "caption", "colgroup", "div", "dl", "dt", "dd",
        "fieldset", "figcaption", "figure", "footer", "form", "head",
        "header", "hgroup", "html", "li", "main", "nav", "ol", "p", "pre", "section", "table", "tbody", "td",
        "tfoot", "th", "thead", "tr", "ul"
    ],
    "miscellany": [
        "area", "audio", "base", "br", "button", "canvas", "col", "datalist", "del", "details", "dialog",
        "embed", "hr", "iframe", "img", "input", "label", "legend", "link", "map", "meta", "meter", "object",
        "optgroup", "option", "output", "param", "picture", "progress", "script", "select", "source",
        "style", "summary", "svg", "template", "textarea", "title", "track", "video"
    ]
}

const baseProps = {
    craft: { custom: { hidden: true } },
}

const categoryProps = {
    text: { craft: { custom: { hidden: false, kinds: { children: "string" } }, props: { children: "hello world!" } } }, // inline, sin placeholder
    container: { craft: { custom: { hidden: false } }, visualUIOnlyFallbackProps: { children: <BasicPlaceHolder /> } }, // mismo que base
}

export default Object.entries(htmlElements).reduce((acc, [category, tags]) => {
    tags.forEach(ele => {
        acc = {
            ...acc,
            ...getBasicHtmlWrapper(ele, { ...baseProps, ...categoryProps[category] })
        }
    })
    return acc
}, {})