export const alignSelf = {
    icon: (props) => {
        switch (props.alignSelf) {
            case 'start':
                return "AlignStartVertical"
            case 'end':
                return "AlignEndVertical"
            case 'stretch':
                return "StretchVertical"
            case 'center':
            default:
                return "AlignCenterVertical"
        }
    },
    menu: [
        {
            action: ({ setProp }) => setProp(props => props['alignSelf'] = 'start'),
            name: "Align Self Start"
        },
        {
            action: ({ setProp }) => setProp(props => props['alignSelf'] = 'center'),
            name: "Align Self Center"
        },
        {
            action: ({ setProp }) => setProp(props => props['alignSelf'] = 'end'),
            name: "Align Self End"
        },
        {
            action: ({ setProp }) => setProp(props => props['alignSelf'] = 'stretch'),
            name: "Align Self Stretch"
        }
    ]
}

export const flexDirection = {
    icon: (props) => {
        switch (props.flexDirection) {
            case 'row':
                return "ArrowRightFromLine"
            case 'row-reverse':
                return "ArrowLeftFromLine"
            case 'column-reverse':
                return "ArrowUpFromLine"
            case 'column':
            default:
                return "ArrowDownFromLine"
        }
    },
    menu: [
        {
            action: ({ setProp }) => setProp(props => props['flexDirection'] = 'row'),
            name: "Row"
        },
        {
            action: ({ setProp }) => setProp(props => props['flexDirection'] = 'row-reverse'),
            name: "Row Reverse"
        },
        {
            action: ({ setProp }) => setProp(props => props['flexDirection'] = 'column'),
            name: "Column"
        },
        {
            action: ({ setProp }) => setProp(props => props['flexDirection'] = 'column-reverse'),
            name: "Column Reverse"
        }
    ]
}

export const fontStyle = {
    icon: (props) => 'Italic',
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
    icon: (props) => 'Bold',
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
    icon: (props) => {
        switch (props.justifyContent) {
            case 'start':
                return "AlignVerticalJustifyStart"
            case 'end':
                return "AlignVerticalJustifyEnd"
            case 'space-between':
                return "AlignVerticalSpaceBetween"
            case 'space-around':
                return "AlignVerticalSpaceAround"
            case 'center':
            default:
                return "AlignVerticalJustifyCenter"
        }
    },
    menu: [
        {
            action: ({ setProp }) => setProp(props => props['justifyContent'] = 'start'),
            name: "Justify Start"
        },
        {
            action: ({ setProp }) => setProp(props => props['justifyContent'] = 'center'),
            name: "Justify Center"
        },
        {
            action: ({ setProp }) => setProp(props => props['justifyContent'] = 'end'),
            name: "Justify End"
        },
        {
            action: ({ setProp }) => setProp(props => props['justifyContent'] = 'space-between'),
            name: "Justify Space Between"
        },
        {
            action: ({ setProp }) => setProp(props => props['justifyContent'] = 'space-around'),
            name: "Justify Space Around"
        }
    ]
}

export const textAlign = {
    icon: (props) => {
        switch (props.textAlign) {
            case 'left':
                return "AlignLeft"
            case 'right':
                return "AlignRight"
            case 'justify':
                return "AlignJustify"
            case 'center':
            default:
                return "AlignCenter"
        }
    },
    menu: [
        {
            action: ({ setProp }) => setProp(props => props['textAlign'] = 'left'),
            name: "Align Text Left"
        },
        {
            action: ({ setProp }) => setProp(props => props['textAlign'] = 'center'),
            name: "Align Text Center"
        },
        {
            action: ({ setProp }) => setProp(props => props['textAlign'] = 'end'),
            name: "Align Text Right"
        },
        {
            action: ({ setProp }) => setProp(props => props['textAlign'] = 'stretch'),
            name: "Justify Text"
        }
    ]
}