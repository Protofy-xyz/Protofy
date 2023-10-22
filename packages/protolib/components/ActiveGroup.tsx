
import { createContext, useState } from 'react'
import React from 'react'
import { Stack } from 'tamagui';

export const ActiveGroupContext = createContext({ active: 0, setActive: (next: number) => { } });

const ActiveGroup = React.forwardRef(({ initialState = 0, children }: any, ref:any) => {
    const [active, setActive] = useState(initialState)

    return (
        <ActiveGroupContext.Provider value={{ active, setActive }}>
            {children}
        </ActiveGroupContext.Provider>
    )
})

export default ActiveGroup