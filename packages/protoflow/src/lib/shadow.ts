export function generateBoxShadow(elevation) {
    if (elevation < 0) elevation = 0;

    const factor = elevation / 10;

    const primaryOpacity = 0.2 * factor;
    const secondaryOpacity = 0.14 * factor;
    const tertiaryOpacity = 0.12 * factor;

    return `0px 3px 5px -1px rgba(0,0,0,${primaryOpacity}), 
            0px 6px 10px 0px rgba(0,0,0,${secondaryOpacity}), 
            0px 1px 18px 0px rgba(0,0,0,${tertiaryOpacity})`;
}
