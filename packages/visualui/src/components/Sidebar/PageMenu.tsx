import React from 'react'
import styles from "../../styles/sidebar.module.css";

const PageMenu = ({ pages, sendMessage, currentPage }) => {
    const viewRef = React.useRef()
    function handleResize(e = {} as any) {
        const viewportHeight = window.outerHeight*0.22;
        if (!viewRef.current) return
        //@ts-ignore
        viewRef.current.style.height = viewportHeight + 'px'
        //@ts-ignore
        viewRef.current.style.maxHeight = viewportHeight + 'px'
    }
    React.useEffect(() => {
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize);
    }, [])

    return (
        <div ref={viewRef} style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
            <div style={{ padding: '20px 0px 0px 14px', fontSize: '18px', color: 'white' }}>Screens</div>
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column', paddingBottom: '10px', overflow: 'auto', overflowX: 'hidden' }} className={styles.list}>
                {pages.filter(p => p).map((pageName, index) => (
                    <div
                        key={index}
                        className={styles.listRow}
                        onClick={() =>
                            sendMessage({ type: 'loadPage', data: { pageName } })
                        }
                    >
                        <div className={styles.iconLabel} style={{ width: '100%', fontSize: '12px', color: currentPage == pageName ? 'white' : 'gray', fontWeight: currentPage == pageName ? "500" : "300" }}>
                            {pageName}
                        </div>
                    </div>
                ))}
            </div>
        </div >
    )
}

export default PageMenu
