import { useContext, useMemo } from "react";
import { ActiveGroupContext } from "./ActiveGroup";
import { Stack, StackProps } from "tamagui";
import React from "react";

// display childrens only if its active (works with ActiveGroup)
const ActiveRender = React.forwardRef(({activeId, fast=false, children, ...props}:any & StackProps, ref:any) => {
    const {active} = useContext(ActiveGroupContext);
    const isActive = active == activeId 
    if(fast) return useMemo(() => <Stack ref={ref} position="absolute" top={isActive?0:-10000} {...props}>{children}</Stack>, [isActive])
    return isActive ? <Stack {...props} ref={ref}>{children}</Stack>:null
})

export default ActiveRender