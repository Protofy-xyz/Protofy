
import { createContext, useState } from 'react'
import React from 'react'
import { Stack } from '@my/ui';

export const ActiveGroupContext = createContext({ active: 0, setActive: (next: number) => { } });

export const ActiveGroup = React.forwardRef(({ initialState = 0, children }: any, ref:any) => {
    const [active, setActive] = useState(initialState)

    return (
        <ActiveGroupContext.Provider value={{ active, setActive }}>
            {children}
        </ActiveGroupContext.Provider>
    )
})

export default ActiveGroup