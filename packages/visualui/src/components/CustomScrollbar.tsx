import { Scrollbars } from 'react-custom-scrollbars-2';

export default ({ children, ...props }) => {
    return <Scrollbars
        universal={true}
        autoHide
        autoHideTimeout={500}
        autoHideDuration={500}
        renderTrackVertical={({ style, ...props }) =>
            <div {...props} style={{ ...style, backgroundColor: 'transparent', right: '2px', bottom: '2px', top: '2px', borderRadius: '3px', width: '5px', marginRight: '6px' }} />
        }
        renderThumbVertical={({ style, ...props }) =>
            <div {...props} style={{ ...style, width: '8px', borderRadius: '4px', backgroundColor: '#767676' }} />
        }
        {...props}
    >
        {children}
    </Scrollbars>
}