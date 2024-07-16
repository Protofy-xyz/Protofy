import React from "react";
import { useUITheme } from "../Theme";
import { Icon } from "protolib/components/Icon";

type Props = {
    componentName: string,
    connectors: any,
    data: any,
    element: any
}

export const ElementCard = ({ componentName, connectors, data, element }: Props) => {
    const interactiveHoverColor = useUITheme('interactiveHoverColor')
    const nodeBackgroundColor = useUITheme('nodeBackgroundColor')
    const textColor = useUITheme('textColor')

    function truncate_with_ellipsis(s, maxLength) {
        if (s.length > maxLength) {
            return s.substring(0, maxLength - 3) + '...';
        }
        return s;
    };

    return (
        <div
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = interactiveHoverColor
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = nodeBackgroundColor
            }}
            title={componentName}
            id={"drag-element-" + componentName}
            className={"draggable-element"}
            ref={ref => connectors.create(ref, () => {
                return (data.dropable) ? element : React.createElement(data.element)
            })}
            style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                textAlign: 'center', cursor: 'grab', borderRadius: '6px',
                padding: '10px 0px', width: '100px', backgroundColor: nodeBackgroundColor
            }}>
            <Icon
                name={data.icon}
                color={textColor}
                size={32}
            />
            <div style={{ marginTop: '14px' }}>
                <p style={{ fontSize: '12px', width: '100%', color: textColor, padding: '5px' }}>
                    {truncate_with_ellipsis(componentName, 12)}
                </p>
            </div>
        </div>
    )
}