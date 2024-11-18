import Editable from 'react-contenteditable';

export const ContentEditable = ({ children, editable = false, onChange = e => {}, ...props }: any) => {
    return <>
        {editable ?
            <Editable
                style={{ border: '2px dashed var(--blue8)' }}
                html={children}
                onChange={onChange}
                {...props}
            />
            : children
        }
    </>
};