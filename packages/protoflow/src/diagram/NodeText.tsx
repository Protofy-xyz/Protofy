import React from 'react';
import useTheme from './Theme';

const NodeText = (props) => {
  const nodeFontSize = useTheme('nodeFontSize')

  return (
    <span
      {...props}
      style={{
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        fontFamily: 'Jost-Regular',
        paddingLeft: '0.4em',
        paddingRight: '0.4em',
        fontSize: nodeFontSize+'px',
        color: useTheme("textColor"),
        ...props.style,
      }}
      title={props.children}
    >
      {props.children}
    </span>
  );
}
export default NodeText
