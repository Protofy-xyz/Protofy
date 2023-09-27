import { useHeroHovered } from './heroState'
import { createContext } from 'react'

export const HoveredGroupContext = createContext({ hovered: 0, setHovered: (next: number) => { } });

const HoveredGroup = ({ children }: any) => {
    const [hovered, setHovered] = useHeroHovered()

    return (<HoveredGroupContext.Provider value={{ hovered, setHovered }}>
            {children}
    </HoveredGroupContext.Provider>
    )
}

export default HoveredGroup