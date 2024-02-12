import React, { useEffect, useRef } from 'react';

const Popover = ({ children, visible, onDismiss }) => {
    const popoverRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target)) {
                onDismiss();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div
            style={{ position: 'relative', display: 'inline-block' }}
        >
            {visible && (
                <div
                    ref={popoverRef}
                    style={{
                        position: 'fixed', width: '250px', height: '380px',
                        top: 0, left: 0, zIndex: 10000, backgroundColor: '#fff',
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", padding: '10px',
                        borderRadius: '4px', minWidth: '200px'
                    }}
                >
                    {children}
                </div>
            )}
        </div>
    );
};
export default Popover;