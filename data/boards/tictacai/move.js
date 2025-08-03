
if(board['game'][params.row][params.col] == '-') {
    await execute_action("game", {
        x: params.col, // position  x only needed when using setCell
        y: params.row, // position y only needed when using setCell
        action: 'setCell', // reset or setCell
        value: board['turn'] == 'A' ? 'x' : 'o', // initialization value when using reset, value for cell when using setCell
    })
    return params.col + ' ' + params.row
}

return 'invalid'
