import nativeBase from 'baseapp/core/themes/nativeBase'
import protofyTheme from 'baseapp/core/themes/protofyTheme';

const emptyTheme = { colors: {}, fontSizes: {} }

let protofyThemeCustom = emptyTheme
try {
    protofyThemeCustom = require('internalapp/themes/protofyTheme.custom').default
} catch (e) { console.error(e) }

let nativeBaseCustom = emptyTheme
try {
    nativeBaseCustom = require('internalapp/themes/nativeBase.custom').default
} catch (e) { console.error(e) }

export const themes = {
    "protofyTheme": {
        ...protofyTheme,
        ...protofyThemeCustom,
        colors: {
            ...protofyTheme.colors,
            ...protofyThemeCustom.colors,
        },
        fontSizes: {
            ...protofyTheme.fontSizes,
            ...protofyThemeCustom.fontSizes,
        }
    },
    "nativeBase": {
        ...nativeBase,
        ...nativeBaseCustom,
        colors: {
            ...nativeBase.colors,
            ...nativeBaseCustom.colors,
        },
        fontSizes: {
            ...nativeBase.fontSizes,
            ...nativeBaseCustom.fontSizes,
        }
    }
}
export const nativeBase_custom = nativeBaseCustom 
export const protofyTheme_custom = protofyThemeCustom 
export const availableThemes = Object.keys(themes)