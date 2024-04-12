import React from "react"

export const ProtoView = React.forwardRef(({ currentView = "default", viewId = "default", placeholder = <></>, ...props }: any, ref: any) => {
    return (
        //@ts-ignore
        <div ref={ref} style={{ display: 'inline' }} {...props}>
            {currentView == viewId && (props.children)}
            {!props.children && placeholder}
        </div>
    )
})