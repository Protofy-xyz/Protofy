export const alignSelf = {
    icon: (props) => props.alignSelf ?? 'center',
    menu: [
        {
            action: ({ setProp }) => setProp(props => props['alignSelf'] = 'start'),
            name: "Align Self Start",
            selected: (props) => props.alignSelf == 'start'
        },
        {
            action: ({ setProp }) => setProp(props => props['alignSelf'] = 'center'),
            name: "Align Self Center",
            selected: (props) => props.alignSelf == 'center'
        },
        {
            action: ({ setProp }) => setProp(props => props['alignSelf'] = 'end'),
            name: "Align Self End",
            selected: (props) => props.alignSelf == 'end'
        },
        {
            action: ({ setProp }) => setProp(props => props['alignSelf'] = 'stretch'),
            name: "Align Self Stretch",
            selected: (props) => props.alignSelf == 'stretch'
        }
    ]
}

export const flexDirection = {
    icon: (props) => props.flexDirection ?? 'column',
    menu: [
        {
            action: ({ setProp }) => setProp(props => props['flexDirection'] = 'row'),
            name: "Row",
            selected: (props) => props.flexDirection == 'row'
        },
        {
            action: ({ setProp }) => setProp(props => props['flexDirection'] = 'row-reverse'),
            name: "Row Reverse",
            selected: (props) => props.flexDirection == 'row-reverse'
        },
        {
            action: ({ setProp }) => setProp(props => props['flexDirection'] = 'column'),
            name: "Column",
            selected: (props) => props.flexDirection == 'column'
        },
        {
            action: ({ setProp }) => setProp(props => props['flexDirection'] = 'column-reverse'),
            name: "Column Reverse",
            selected: (props) => props.flexDirection == 'column-reverse'
        }
    ]
}

export const fontStyle = {
    icon: (props) => 'italic',
    selected: (props) => props.fontStyle == 'italic',
    action: ({ setProp }) => setProp(props => {
        if (props.fontStyle == 'italic') {
            props['fontStyle'] = 'normal'
        } else {
            props['fontStyle'] = 'italic'
        }
        return props
    })
}

export const fontWeight = {
    icon: (props) => 'bold',
    selected: (props) => props.fontWeight == 'bold',
    action: ({ setProp }) => setProp(props => {
        if (props.fontWeight == 'bold') {
            props['fontWeight'] = 'normal'
        } else {
            props['fontWeight'] = 'bold'
        }
        return props
    })
}

export const justifyContent = {
    icon: (props) => props.justifyContent ?? 'center',
    menu: [
        {
            action: ({ setProp }) => setProp(props => props['justifyContent'] = 'start'),
            name: "Justify Start",
            selected: (props) => props.justifyContent == 'start'
        },
        {
            action: ({ setProp }) => setProp(props => props['justifyContent'] = 'center'),
            name: "Justify Center",
            selected: (props) => props.justifyContent == 'center'
        },
        {
            action: ({ setProp }) => setProp(props => props['justifyContent'] = 'end'),
            name: "Justify End",
            selected: (props) => props.justifyContent == 'end'
        },
        {
            action: ({ setProp }) => setProp(props => props['justifyContent'] = 'space-between'),
            name: "Justify Space Between",
            selected: (props) => props.justifyContent == 'space-between'
        },
        {
            action: ({ setProp }) => setProp(props => props['justifyContent'] = 'space-around'),
            name: "Justify Space Around",
            selected: (props) => props.justifyContent == 'space-around'
        }
    ]
}

export const textAlign = {
    icon: (props) => 'text',
    menu: [
        {
            action: ({ setProp }) => setProp(props => props['textAlign'] = 'left'),
            name: "Align Text Left",
            selected: (props) => props.textAlign == 'left'
        },
        {
            action: ({ setProp }) => setProp(props => props['textAlign'] = 'center'),
            name: "Align Text Center",
            selected: (props) => props.textAlign == 'center'
        },
        {
            action: ({ setProp }) => setProp(props => props['textAlign'] = 'end'),
            name: "Align Text Right",
            selected: (props) => props.textAlign == 'end'
        },
        {
            action: ({ setProp }) => setProp(props => props['textAlign'] = 'stretch'),
            name: "Justify Text",
            selected: (props) => props.textAlign == 'stretch'
        }
    ]
}

export const resizeMode = {
    icon: (props) => "wallpaper",
    menu: [
        {
            action: ({ setProp }) => setProp(props => props['resizeMode'] = 'center'),
            name: "Center",
            selected: (props) => props.resizeMode == 'center'
        },
        {
            action: ({ setProp }) => setProp(props => props['resizeMode'] = 'contain'),
            name: "Contain",
            selected: (props) => props.resizeMode == 'contain'
        },
        {
            action: ({ setProp }) => setProp(props => props['resizeMode'] = 'cover'),
            name: "Cover",
            selected: (props) => props.resizeMode == 'cover'
        },
        {
            action: ({ setProp }) => setProp(props => props['resizeMode'] = 'repeat'),
            name: "Repeat",
            selected: (props) => props.resizeMode == 'repeat'
        },
        {
            action: ({ setProp }) => setProp(props => props['resizeMode'] = 'stretch'),
            name: "Stretch",
            selected: (props) => props.resizeMode == 'stretch'
        }
    ]
}