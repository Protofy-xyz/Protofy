export const textCurve = (zoomLevel, min = 0.35, max = 0.45) => {
    var opacity = Math.max(0, Math.min(1, zoomLevel / 1.5))
    opacity = opacity < min ? 0 : opacity
    opacity = opacity > max ? 1 : opacity
    return opacity
}

/**
 * Compute the zoom factor based on the current zoom level.
 * 
 * @param {number} currentZoom - The current zoom level (0 to 2).
 * @param {number} [b=2] - Controls the steepness of the exponential curve. 
 *                         Higher values make the exponential curve steeper.
 * @param {number} [q=8.33] - Controls the curvature of the quadratic function. 
 *                            Higher values will make the curve sharper.
 * @param {number} [x0=0.7] - Determines the point of inflection for the weight function 
 *                            (the point where the transition between quadratic and exponential is most noticeable).
 * @param {number} [maxFactor=12.5] - Determines the maximum factor by which the font size can grow.
 * 
 * @returns {number} The font size multiplier based on the current zoom level.
 */
function computeZoomFactor(currentZoom,
    b = 4.5,
    q = 8,
    x0 = 0.99,
    maxFactor = 12.5) {
    if (currentZoom >= 1) {
        return 1; // This means no change in the font, it's at its base size.
    }

    const a = -maxFactor;
    const c = maxFactor;

    // Exponential function
    const exponential = a * (1 - Math.exp(-b * currentZoom)) + c;

    // Quadratic function
    const quadratic = -q * Math.pow(currentZoom - 1, 2) + 1;

    // Weight based on sigmoidal function
    const w = 1 / (1 + Math.exp(-20 * (currentZoom - x0)));

    // Combine the functions
    const combinedFactor = w * quadratic + (1 - w) * exponential;

    // Ensure the factor is never less than 1
    return Math.max(combinedFactor, 1);
}

export const fontSizeCurve = (zoomLevel) => {
    const result = computeZoomFactor(zoomLevel) * 20;
    console.log('compunting zoom for level: ', zoomLevel, result)
    return 40; //Math.min(120,result);
}
export const zoomCurve = (zoomLevel) => 100//Math.max(100, Math.max(0, 0.75-zoomLevel)*200)

export const zoomSelector = (s) => s.transform[2] > 0.15;