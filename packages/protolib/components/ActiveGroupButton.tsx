import React, { useContext } from "react";
import { Button, ButtonProps, Stack, XGroup } from "@my/ui";
import { ActiveGroupContext } from "./ActiveGroup";
import GroupButton from "./GroupButton";

export const ActiveGroupButton = React.forwardRef(({ activeId, onSetActive=(activeId)=>{}, ...props }: ButtonProps & { onSetActive?: any, activeId: any }, ref: any) => {
    const { active, setActive } = useContext(ActiveGroupContext);
    return <GroupButton 
        onPress={() => {onSetActive(activeId); setActive(activeId)}}
        theme={activeId === active ? 'active' : null}
        chromeless={activeId !== active}
        bc={activeId === active ? '$gray6' : '$gray2'}
        hoverStyle={{ backgroundColor: activeId === active ? '$gray6' : '$gray4' }}
        {...props}
    />
})

export default ActiveGroupButton