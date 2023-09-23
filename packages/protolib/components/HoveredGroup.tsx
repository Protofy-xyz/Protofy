import { useHeroHovered } from './heroState'
import { createContext, useContext } from 'react'

export const HoveredGroupContext = createContext({hovered:0, setHovered:(next:number)=>{}});

const HoveredGroup = ({children}) => {
    const [hovered, setHovered] = useHeroHovered()
    
    return (<HoveredGroupContext.Provider value={{hovered, setHovered}}>
                {children}
            </HoveredGroupContext.Provider>
    )
}

export default HoveredGroup