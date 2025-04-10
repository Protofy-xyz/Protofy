import React, { CSSProperties } from 'react';
import useTheme from './diagram/Theme';


function useHover(styleOnHover: CSSProperties, styleOnNotHover: CSSProperties = {}, customStyle = {}) {
    const [style, setStyle] = React.useState(styleOnNotHover);

    const onMouseEnter = () => setStyle(styleOnHover)
    const onMouseLeave = () => setStyle(styleOnNotHover)

    return { style: { ...style, customStyle }, onMouseEnter, onMouseLeave }
}

export default ({ onPress, label, style = {} }) => {
    const nodeFontSize = useTheme('nodeFontSize')
    const borderColor = useTheme('borderColor')
    const hoverBg = useTheme('interactiveHoverColor')
    const textColor = useTheme('textColor')

    const baseStyle: CSSProperties = {
        padding: "8px 16px",
        fontSize: nodeFontSize - 1,
        fontFamily: 'Jost-Regular',
        backgroundColor: 'transparent',
        border: `1px solid ${borderColor}`,
        borderRadius: 4,
        color: textColor,
        cursor: 'pointer',
        transition: 'background-color 0.15s ease, border-color 0.15s ease',
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
        lineHeight: '1',
        userSelect: 'none',
        ...style
    }

    const [hovered, setHovered] = React.useState(false)

    return (
        <div style={{ display: 'flex', justifyContent: "center", marginTop: '8px' }}>
            <button
                onClick={onPress}
                style={{
                    ...baseStyle,
                    backgroundColor: hovered ? hoverBg : 'transparent'
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {label}
            </button>
        </div>
    )
}

