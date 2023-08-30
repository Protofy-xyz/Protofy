import stylePanel from "./ui/configPanel/stylePanel";
import Color from "./lib/Color";
import configElement from "./ui/configPanel/configPanelElement"
import propsPanel from "./ui/configPanel/propsPanel";


export const Conf = configElement

export const getPropConfs = propsPanel
export const getStyleConfs = stylePanel

export const getWeight = (color: string) => Color.parse(color).getWeight()
export const toColor = (color: string, theme?) => Color.parse(color).toColor(theme)

export const defaultStyle = {}
export const defaultProps = {
    color: 'primary',
    style: {}
}
