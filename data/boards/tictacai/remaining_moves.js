// El código cuenta el número de casillas vacías que quedan en el "board" al sumar los símbolos '-' en la matriz de juego.
return board?.['game'].flat().filter(cell => cell === '-').length;