import React, { CSSProperties } from 'react';
import useTheme from './diagram/Theme';


function useHover(styleOnHover: CSSProperties, styleOnNotHover: CSSProperties = {}, customStyle = {}) {
    const [style, setStyle] = React.useState(styleOnNotHover);

    const onMouseEnter = () => setStyle(styleOnHover)
    const onMouseLeave = () => setStyle(styleOnNotHover)

    return { style: { ...style, customStyle }, onMouseEnter, onMouseLeave }
}

export default ({ onPress, label, style = {} }) => {
    const sharedProps = {
        width: '50%',
        margin: '15px',
        border: '0px solid transparent',
        borderRadius: '8px',
        color: useTheme('interactiveColor'),
        padding: "10px 15px",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
        display: 'flex', 
        position: 'relative', 
        alignSelf: 'center', 
        textAlign: 'center', 
        alignItems: 'stretch', 
        boxSizing: 'border-box',
        flexBasis: 'auto', 
        flexDirection: 'column', 
        flexShrink: '0',
        listStyle: 'none', 
        textDecoration: 'none',
        zIndex: '0', 
        fontFamily: 'Jost-Regular',
        fontSize: useTheme('nodeFontSize'),
        ...style
    }
    const hover = useHover({
        ...sharedProps,
        backgroundColor: useTheme('interactiveHoverColor')
    } as any, {
        ...sharedProps,
        backgroundColor: "transparent"
    } as any, style);

    return <div style={{ display: 'flex', justifyContent: "center" }}>
        <button onClick={onPress} {...hover} >{label}</button>
    </div>;
};

