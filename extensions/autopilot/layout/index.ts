let lastPlacedPosition = { x: -1, y: 0 };

export function create2DArray(rows, cols, value = false) {
    const arr = [];
    for (let i = 0; i < rows; i++) {
        arr.push(new Array(cols).fill(value));
    }
    return arr;
}

/**
 * Busca en las filas a partir de 'startRow' un bloque contiguo de tamaño w×h libre.
 * Devuelve el índice de columna donde lo encontró (o null si no lo encuentra).
 */
export function findSpaceInRows(occupied, startRow, w, h) {
    const totalCols = occupied[0].length; // Número de columnas
    // Para cada fila (desde startRow) comprobamos si hay espacio
    // en horizontal (col..col+w-1) y en vertical (row..row+h-1).
    for (let col = 0; col <= totalCols - w; col++) {
        let allFree = true;
        for (let rowOffset = 0; rowOffset < h; rowOffset++) {
            const rowIndex = startRow + rowOffset;
            // Si la fila no existe en occupied, salimos (no hay más filas)
            if (rowIndex >= occupied.length) {
                allFree = false;
                break;
            }
            // Comprobamos celdas de la columna col..col+w-1
            for (let c = col; c < col + w; c++) {
                if (occupied[rowIndex][c]) {
                    allFree = false;
                    break;
                }
            }
            if (!allFree) break;
        }
        if (allFree) {
            return col; // Devuelve la columna de inicio donde cabe
        }
    }
    return null;
}

/**
 * Busca la primera posición libre en 'occupied' para un widget de w×h,
 * extiende el array si es necesario y devuelve { x, y, w, h }.
 */
export function placeWidget(occupied, w, h) {
    const totalCols = occupied[0].length;
    const maxRows = 1000;

    // Aseguramos que haya suficientes filas
    while (occupied.length < lastPlacedPosition.y + h) {
        occupied.push(new Array(totalCols).fill(false));
    }

    // Intentamos colocar a la derecha de la última tarjeta colocada
    const startY = lastPlacedPosition.y;
    const startX = lastPlacedPosition.x + 1;

    for (let row = startY; row < maxRows; row++) {
        while (occupied.length < row + h) {
            occupied.push(new Array(totalCols).fill(false));
        }

        const colStart = (row === startY) ? startX : 0;
        for (let col = colStart; col <= totalCols - w; col++) {
            let fits = true;
            for (let dy = 0; dy < h && fits; dy++) {
                for (let dx = 0; dx < w && fits; dx++) {
                    if (occupied[row + dy][col + dx]) {
                        fits = false;
                    }
                }
            }

            if (fits) {
                // Marcar como ocupado
                for (let dy = 0; dy < h; dy++) {
                    for (let dx = 0; dx < w; dx++) {
                        occupied[row + dy][col + dx] = true;
                    }
                }

                // Actualiza el último widget colocado
                lastPlacedPosition = { x: col, y: row };

                return { x: col, y: row, w, h };
            }
        }
    }

    throw new Error("No se pudo colocar el widget");
}

/**
 * Coloca secuencialmente los widgets en el grid, calculando su (x, y, w, h).
 * - totalCols: número total de columnas del grid en este breakpoint.
 * - normalW, normalH: ancho y alto (en unidades de grid) de un widget "normal".
 * - doubleW, doubleH: ancho y alto de un widget "doble".
 */
export function computeLayout(items, config, options: any = {}) {
    const { doubleWidgets = [], layout = {} } = options;
    // console.log('doubleWidgets', doubleWidgets);
    const { totalCols, normalW, normalH, doubleW, doubleH } = config;
    lastPlacedPosition = { x: -1, y: 0 };

    if (Array.isArray(layout)) {
        for (const l of layout) {
            if (typeof l.x === 'number' && typeof l.y === 'number') {
                const right = l.x + (l.w ?? 1);
                const bottom = l.y + (l.h ?? 1);
                const currentBottom = lastPlacedPosition.y + 1;

                if (l.y === lastPlacedPosition.y && right > lastPlacedPosition.x) {
                    // misma fila, más a la derecha
                    lastPlacedPosition.x = right - 1;
                }

                if (bottom - 1 > lastPlacedPosition.y) {
                    // fila más abajo, actualizamos y usamos su x final
                    lastPlacedPosition.y = bottom - 1;
                    lastPlacedPosition.x = l.x + (l.w ?? 1) - 1;
                }
            }
        }
    }
    // Iniciamos occupied con 1 sola fila (la iremos ampliando según sea necesario).
    let occupied = create2DArray(1, totalCols, false);
    const newlayout = [];

    for (const widget of items) {
        const prevLayout = layout && layout.find && layout.find((l) => l.i == widget.key)
        if (prevLayout) {
            newlayout.push(prevLayout);
            continue;
        }
        let w, h;
        if (widget.width && widget.height && !prevLayout) {
            w = Math.ceil(widget.width * (normalW / 4));
            h = Math.ceil(widget.height * (normalH / 5.5));
        } else if (doubleWidgets.includes(widget.key)) {
            // Widget "doble"
            w = doubleW;
            h = doubleH;
        } else {
            // Widget "normal"
            w = normalW;
            h = normalH;
        }

        if (w > totalCols) { // 🔧 PATCH: evita freeze si el widget no cabe
            console.warn(`El widget '${widget.key}' con w=${w} no cabe en totalCols=${totalCols}. Se omite.`);
            continue;
        }

        // Obtenemos la posición donde se puede colocar
        const { x, y, w: finalW, h: finalH } = placeWidget(occupied, w, h);
        newlayout.push({
            i: widget.key,
            x,
            y,
            w: finalW,
            h: finalH,
            isResizable: true
        });
    }
    return newlayout;
}