import React, { useContext } from "react";
import { Button, ButtonProps, Stack, XGroup } from "tamagui";
import { ActiveGroupContext } from "./ActiveGroup";

const ActiveGroupButton = React.forwardRef(({ activeId, ...props }: ButtonProps & { activeId: any }, ref: any) => {
    const { active, setActive } = useContext(ActiveGroupContext);
    return (<Stack ref={ref}>
        <XGroup.Item key={activeId}>
            <Button {...{
                onPress: () => setActive(activeId),
                theme: activeId === active ? 'active' : null,
                chromeless: activeId !== active,
                borderRadius: 0,
                size: "$3",
                fontFamily: "$silkscreen",
                ...props
            }} />
        </XGroup.Item>
    </Stack>
    )
})

export default ActiveGroupButton