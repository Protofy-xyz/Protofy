// Este código determina de quién es el turno basándose en el número de movimientos restantes en el tablero de juego.
// Si el número de movimientos restantes es impar, es el turno de A; si es par, es el turno de B. Si no hay movimientos restantes, devuelve '-'.
return board?.['remaining_moves'] === 0 ? '-' : board?.['remaining_moves'] % 2 !== 0 ? 'A' : 'B';