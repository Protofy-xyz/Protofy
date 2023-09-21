import { TintSection } from "./TintSection"
import { useTint } from "@tamagui/logo"
import { StackProps } from "tamagui"
import { Theme } from "tamagui"

function TintTheme({ children }) {
    const { tint, name } = useTint()
    console.log('tint: ', tint)
    // const element = useAlwaysConcurrent()
  
    return (
      <Theme name={tint as any}>
          {children}
      </Theme>
    )
}

type SectionProps = {
    children?: any,
    sectionProps?:any,
    containerProps?: StackProps
}

const Section = ({containerProps={},children, sectionProps={index:0}}:SectionProps) => (
    <TintTheme>{children}</TintTheme>
)

export default Section