import { useContext } from "react";
import { ActiveGroupContext } from "./ActiveGroup";
import { Stack } from "tamagui";
import React from "react";

// display childrens only if its active (works with ActiveGroup)
const ActiveRender = React.forwardRef(({activeId, children}:any, ref:any) => {
    const {active} = useContext(ActiveGroupContext);

    return active == activeId ? <Stack ref={ref}>{children}</Stack> : null
})

export default ActiveRender