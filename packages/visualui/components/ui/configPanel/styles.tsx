import systemTheme from "baseapp/core/themes/protofyTheme";

export const spanStyle = {
    width: 130,
    height: '35px',
    fontFamily: systemTheme.fontConfig.Jost['400'].normal,
    fontSize: '16px',
    paddingRight: '15px',
    textAlign: 'right',
    marginTop: '-5px',
    backgroundColor: 'transparent',
    border: '0px',
    color: '#cccccc',
    borderRadius: '14px',
    overflow: 'hidden', 
    textOverflow: 'ellipsis'
}

export const elementStyle = {
    width: '30px',
    color: '#cccccc',
    backgroundColor: '#303031', //'rgb(47 46 54)'
    marginTop: '-10px',
    borderRadius: '14px',
    border: '0px',
}

export const fullWidthElementStyle = {
    ...elementStyle,
    width: '180px',
    fontFamily: systemTheme.fontConfig.Jost['400'].normal,
    fontSize: '14px',
    padding: '14px'
}

export const containerStyle = {
    display: 'flex',
    marginBottom: '15px',
    textAlign: 'left'
}

export default {
    spanStyle,
    elementStyle,
    fullWidthElementStyle,
    containerStyle
}