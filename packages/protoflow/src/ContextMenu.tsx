export function ContextMenu({
    children,
    id,
    top,
    left,
    right,
    bottom,
    ...props
}) {
    return (
        <div
            {...props}
            style={{ top, left, right, bottom, display: 'flex', flexDirection: 'column', position: 'absolute', zIndex: 10, ...props?.style }}
        >
            {children}
        </div>
    );
}
