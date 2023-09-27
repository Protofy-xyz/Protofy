import { useHeroHovered } from './heroState'
import { createContext, forwardRef } from 'react'
import { XStack } from "tamagui"

export const HoveredGroupContext = createContext({ hovered: 0, setHovered: (next: number) => { } });

const HoveredGroup = forwardRef(({ children }: any, ref: any) => {
    const [hovered, setHovered] = useHeroHovered()

    return (<HoveredGroupContext.Provider value={{ hovered, setHovered }}>
        <XStack ref={ref}>
            {children}
        </XStack>
    </HoveredGroupContext.Provider>
    )
})

export default HoveredGroup