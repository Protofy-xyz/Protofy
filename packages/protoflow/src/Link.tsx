import React from 'react';
import useTheme from './diagram/Theme';

export default ({ href, ...props }) => {

    return <div style={{ display: 'flex', justifyContent: "center" }}>
        <a target="_blank" href={href} style={{
            color: useTheme('interactiveColor'),
            padding: "10px 15px",
            cursor: "pointer",
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'Jost-Regular',
            fontSize: useTheme('nodeFontSize'),
        }}
        onMouseEnter={e => {
            e.currentTarget.style.textDecorationLine = "underline"
        }}
        onMouseLeave={e => {
            e.currentTarget.style.textDecorationLine = ""
        }}
        >
            {props.children}
        </a>
    </div>
};

