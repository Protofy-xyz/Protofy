import React, { useContext } from "react";
import { Button, ButtonProps, Stack, XGroup } from "tamagui";
import { ActiveGroupContext } from "./ActiveGroup";
import GroupButton from "./GroupButton";

export const ActiveGroupButton = React.forwardRef(({ activeId, onSetActive=(activeId)=>{}, ...props }: ButtonProps & { onSetActive?: any, activeId: any }, ref: any) => {
    const { active, setActive } = useContext(ActiveGroupContext);
    return <GroupButton 
        onPress={() => {onSetActive(activeId); setActive(activeId)}}
        theme={activeId === active ? 'active' : null}
        chromeless={activeId !== active}
        {...props}
    />
})

export default ActiveGroupButton