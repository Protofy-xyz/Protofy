import React, { useEffect, useRef, useState } from 'react';

const Popover = ({ children, trigger }) => {
    const [isPopoverVisible, setIsPopoverVisible] = useState(false);

    const popoverRef = useRef(null);
    // const arrowHeight = '10px'

    const showPopover = () => {
        setIsPopoverVisible(true);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target)) {
                setIsPopoverVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <div onClick={showPopover}>
                {trigger}
            </div>
            <div
                style={{ position: 'relative', display: 'inline-block' }}
            >
                {isPopoverVisible && (
                    <div
                        ref={popoverRef}
                        style={{
                            position: 'fixed', width: '250px',
                            top: 0, left: '50%', zIndex: 10000, backgroundColor: '#fff',
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", padding: '10px',
                            borderRadius: '4px', minWidth: '200px', transform: 'translateX(-50%)'
                        }}
                    >
                        {/* <div style={{ position: 'absolute', width: 0, height: 0, top: '-' + arrowHeight, left: '108px' }} >
                            <div style={{ width: 0, height: 0, borderRight: '10px solid transparent', borderLeft: '10px solid transparent', borderBottom: arrowHeight + ' solid #fff', transform: 'translateX(-50%)' }} ></div>
                        </div> */}
                        {children}
                    </div>
                )}
            </div>
        </>
    );
};
export default Popover;