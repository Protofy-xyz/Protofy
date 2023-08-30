import create from "zustand";
import produce from "immer";
import { availableThemes } from "../themes";
import { themeName as currentThemeName } from 'internalapp/themes/currentTheme'
import { protofyTheme_custom as customProtofyTheme } from '../themes'
import { nativeBase_custom as customNativeBase } from '../themes'

const customTable = {
    protofyTheme: customProtofyTheme,
    nativeBase: customNativeBase
}
type ThemeStoreData = {
    theme: any,
    setTheme: Function,
    selectedTheme: string,
    setSelectedTheme: Function,
    customColors: Object,
    setCustomColors: Function,
    pickerVisible: string,
    setPickerVisible: Function,
    fontSizes: Object,
    setFontSizes: Function
}

export const useThemeStore = create<ThemeStoreData>((set) => ({
    pickerVisible: '',
    selectedTheme: currentThemeName ?? availableThemes[0],
    customColors: customTable[currentThemeName]?.colors,
    theme: { colors: {} },
    fontSizes: customTable[currentThemeName]?.fontSizes,
    setSelectedTheme: (selected: string) => set(produce((draft: ThemeStoreData) => {
        draft.customColors = customTable[selected]?.colors
        draft.fontSizes = customTable[selected]?.fontSizes
        draft.selectedTheme = selected;
    })),
    setPickerVisible: (selected: string) => set(produce((draft: ThemeStoreData) => {
        draft.pickerVisible = selected;
    })),
    setTheme: (theme: Object) => set(produce((draft: ThemeStoreData) => {
        draft.theme = theme;
    })),
    setFontSizes: (sizeName: string, sizeValue: string) => set(produce((draft: ThemeStoreData) => {
        draft.fontSizes = {
            ...draft.fontSizes,
            [sizeName]: sizeValue
        }
    })),
    setCustomColors: (colorName: string, colorValue: string) => set(produce((draft: ThemeStoreData) => {
        const hexToRgb = (hex) => {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? [
                parseInt(result[1], 16),
                parseInt(result[2], 16),
                parseInt(result[3], 16)
            ] : [0, 0, 0];
        }
        const color = hexToRgb(colorValue)
        const hsvColor = rgbToHsv(color[0], color[1], color[2])
        const palette = {}
        for (let i = 0; i < 10; i++) {
            var key = i * 100
            if (!key) key = 50
            const rgbColor = hsvToRgb(hsvColor[0], hsvColor[1], hsvColor[2] - ((6 - i) * 0.05))
            palette[key] = rgbToHex(Math.trunc(rgbColor[0]), Math.trunc(rgbColor[1]), Math.trunc(rgbColor[2]))
        }
        draft.customColors = {
            ...draft.customColors,
            [colorName]: {
                ...palette
            }
        };
    })),
}));

function rgbToHsv(r, g, b) {
    r /= 255, g /= 255, b /= 255;

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max == 0 ? 0 : d / max;

    if (max == min) {
        h = 0; // achromatic
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return [h, s, v];
}
function hsvToRgb(h, s, v) {
    var r, g, b;

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return [r * 255, g * 255, b * 255];
}
function valueToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
    return ('#' + valueToHex(r) + valueToHex(g) + valueToHex(b));

}