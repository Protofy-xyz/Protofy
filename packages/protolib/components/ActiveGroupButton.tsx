import React, { useContext } from "react";
import { Button, ButtonProps, Stack, XGroup } from "tamagui";
import { ActiveGroupContext } from "./ActiveGroup";

const ActiveGroupButton = React.forwardRef(({ activeId, onSetActive=(activeId)=>{}, ...props }: ButtonProps & { onSetActive?: any, activeId: any }, ref: any) => {
    const { active, setActive } = useContext(ActiveGroupContext);
    return (<Stack ref={ref}>
        <XGroup.Item key={activeId}>
            <Button {...{
                onPress: () => {onSetActive(activeId); setActive(activeId)},
                theme: activeId === active ? 'active' : null,
                chromeless: activeId !== active,
                borderRadius: 0,
                size: "$3",
                // fontFamily: "$silkscreen",
                ...props
            }} />
        </XGroup.Item>
    </Stack>
    )
})

export default ActiveGroupButton