import { useState, createElement } from 'react'
import { Popover } from "@my/ui";
import { useUITheme } from "./Theme";
import { Check } from 'lucide-react'

export const MenuOption = ({ name, icon = undefined, selected = false, ...props }: any) => {
    const [hover, setHover] = useState(false)
    const color = hover ? useUITheme('interactiveColor') : useUITheme('textColor')

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
        <div style={{ color: color }}>
            {name}
        </div>
        <div>
            {icon ? createElement(icon, { color: color, size: 16, paddingTop: '2px' }) : null}
            {selected ? <Check size={16} style={{marginLeft: '10px'}} color={color} /> : null}
        </div>
    </div>
}

export const UIMenu = ({ trigger, content, onOpenChange, ...props }) => {
    return <Popover allowFlip onOpenChange={onOpenChange} {...props}>
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
            bc={useUITheme('nodeBackgroundColor')}
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