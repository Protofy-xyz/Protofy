import { Popover } from "@my/ui";
import visualUItheme from "./Theme";

export const UIMenu = ({ trigger, content, onOpenChange, ...props }) => {
    return <Popover placement="top" onOpenChange={onOpenChange}>
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
            bc={visualUItheme.nodeBackgroundColor}
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