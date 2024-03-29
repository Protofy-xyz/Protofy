export function generateBoxShadow(elevation, r=0, g=0, b=0) {
    if (elevation < 0) elevation = 0;

    const factor = elevation / 10;

    const primaryOpacity = 0.2 * factor;
    const secondaryOpacity = 0.14 * factor;
    const tertiaryOpacity = 0.12 * factor;

    return `0px 3px 5px -1px rgba(${r},${g},${b},${primaryOpacity}), 
            0px 6px 10px 0px rgba(${r},${g},${b},${secondaryOpacity}), 
            0px 1px 18px 0px rgba(${r},${g},${b},${tertiaryOpacity})`;
}
