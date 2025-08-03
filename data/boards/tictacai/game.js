const matrix = board?.[name];

if (params.action === 'reset') {
  const width = params.width;
  const height = params.height;
  const initialValue = params.value;

  if (!Number.isInteger(width) || width <= 0 ||
      !Number.isInteger(height) || height <= 0) {
    throw new TypeError('matrix reset error: width and height should positive numbers');
  }

  // Nueva matriz de height x width
  return Array.from({ length: height }, () =>
    Array.from({ length: width }, () => initialValue)
  );
} else {
  if (!Array.isArray(matrix)) {
    throw new Error('matrix set error: cannot set a value in an empty matrix');
  }

  const posX = params.x;
  const posY = params.y;
  const val = params.value;

  if (!Number.isInteger(posY) || posY < 0 || posY >= matrix.length) {
    throw new RangeError(`matrix set error: y out of range: ${posY}`);
  }
  const row = matrix[posY];
  if (!Array.isArray(row)) {
    throw new TypeError(`matrix set error: invalud row`);
  }
  if (!Number.isInteger(posX) || posX < 0 || posX >= row.length) {
    throw new RangeError(`matrix set error x out of range: ${posX}`);
  }

  // Copia inmutable y set
  const next = matrix.map(r => r.slice());
  next[posY][posX] = val;
  return next;
}