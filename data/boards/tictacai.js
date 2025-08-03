const { boardConnect } = require('protonode')
const { Protofy } = require('protobase')

const run = Protofy("code", async ({ context, states, board }) => {
board.onChange({
    name: 'turn',
    changed: async (value) => {
        let winner = checkWinner(states.game);
        if (winner === 'A') {
            await board.execute_action({ name: 'Player A win' });
            return;
        } else if (winner === 'B') {
            await board.execute_action({ name: 'Player B win' });
            return;
        }

        if (states.remaining_moves === 0) {
            await board.execute_action({ name: 'Draw' });
            return;
        }

        if (value === 'A') {
            await board.execute_action({ name: 'Player A' });
        } else if (value === 'B') {
            await board.execute_action({ name: 'Player B' });
        }
    }
});

async function startNewGame() {
    await board.execute_action({ name: 'new game' });
}

function checkWinner(board) {
  const lines = [
    // Filas
    [ [0,0], [0,1], [0,2] ],
    [ [1,0], [1,1], [1,2] ],
    [ [2,0], [2,1], [2,2] ],
    // Columnas
    [ [0,0], [1,0], [2,0] ],
    [ [0,1], [1,1], [2,1] ],
    [ [0,2], [1,2], [2,2] ],
    // Diagonales
    [ [0,0], [1,1], [2,2] ],
    [ [0,2], [1,1], [2,0] ],
  ];

  for (const line of lines) {
    const [a, b, c] = line;
    const val = board[a[0]][a[1]];
    if (val !== '-' && val === board[b[0]][b[1]] && val === board[c[0]][c[1]]) {
      return val == 'x' ? 'A' : 'B'; // 'x' o 'o'
    }
  }

  return null; // Nadie ha ganado aún
}

startNewGame();
})

boardConnect(run)