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