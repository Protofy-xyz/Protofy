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
    let row = 0;
    const maxRows = 1000; // 🔧 PATCH: límite de seguridad

    while (row < maxRows) { // 🔧 PATCH: antes era while (true)
        // Aseguramos que existan suficientes filas en 'occupied' para verificar row..row+h-1
        while (row + h > occupied.length) {
            // Añadimos más filas al final
            occupied.push(new Array(occupied[0].length).fill(false));
        }

        // Intentamos buscar espacio en la fila 'row'
        const startCol = findSpaceInRows(occupied, row, w, h);
        if (startCol != null) {
            // ¡Encontramos un hueco! Marcamos esas celdas como ocupadas
            for (let r = row; r < row + h; r++) {
                for (let c = startCol; c < startCol + w; c++) {
                    occupied[r][c] = true;
                }
            }
            return { x: startCol, y: row, w, h };
        }
        // Si no encontramos hueco, incrementamos la fila y volvemos a probar
        row++;
    }

    throw new Error(`No se pudo colocar el widget de tamaño w=${w}, h=${h} tras ${maxRows} filas.`); // 🔧 PATCH
}

/**
 * Coloca secuencialmente los widgets en el grid, calculando su (x, y, w, h).
 * - totalCols: número total de columnas del grid en este breakpoint.
 * - normalW, normalH: ancho y alto (en unidades de grid) de un widget "normal".
 * - doubleW, doubleH: ancho y alto de un widget "doble".
 */
export function computeLayout(items, config, options:any={}) {
    const { doubleWidgets = [], layout = {} } = options;
    // console.log('doubleWidgets', doubleWidgets);
    const { totalCols, normalW, normalH, doubleW, doubleH } = config;

    // Iniciamos occupied con 1 sola fila (la iremos ampliando según sea necesario).
    let occupied = create2DArray(1, totalCols, false);
    const newlayout = [];

    for (const widget of items) {
        const prevLayout = layout && layout.find && layout.find((l) => l.i == widget.key)
        if(prevLayout){
            newlayout.push(prevLayout);
            continue;
        }
        let w, h;
        if(widget.width && widget.height){
            w = widget.width;
            h = widget.height;
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