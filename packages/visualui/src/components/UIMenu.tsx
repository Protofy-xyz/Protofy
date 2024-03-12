import {useState, createElement} from 'react'
import { Popover } from "@my/ui";
import uiTheme from "./Theme";

export const MenuOption = ({ name, icon = undefined, ...props }: any) => {
    const [hover, setHover] = useState(false)
    return <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        {...props}
        style={{
            cursor: "pointer", justifyContent: 'space-between', width: '100%',
            display: 'flex', alignItems: 'center', flex: 1, alignSelf: 'flex-start',
            padding: '12px',
            ...props.style
        }}
    >
        <div style={{ color: hover ? uiTheme.interactiveColor : uiTheme.textColor }}>
            {name}
        </div>
        <div>
            {icon ? createElement(icon, { color: hover ? uiTheme.interactiveColor : uiTheme.textColor, size: 16, paddingTop: '2px' }) : null}
        </div>
    </div>
}

export const UIMenu = ({ trigger, content, onOpenChange, ...props }) => {
    return <Popover placement="top" onOpenChange={onOpenChange} {...props}>
        <Popover.Trigger>
            {
                trigger
            }
        </Popover.Trigger>
        {content ? <Popover.Content
            width="250px"
            padding="$2"
            paddingRight="$0"
            br="$0"
            bw="1px"
            display="flex"
            shadowRadius={"$4"}
            shadowColor={"black"}
            boc="gray"
            shadowOpacity={0.6}
            bc={uiTheme.nodeBackgroundColor}
            maxHeight={"350px"}
            //@ts-ignore
            overflow='scroll' overflowX="hidden"
        >
            {
                content
            }
        </Popover.Content> : null}
    </Popover>
}