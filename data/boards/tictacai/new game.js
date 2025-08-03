// This JavaScript implementation initializes a new Tic-Tac-Toe game by resetting the game board to a 3x3 grid, all cells initialized to '-'. 
// It also resets the player states associated with Player A and Player B, starting a fresh game session.

// Reset the game board to a 3x3 grid with all cells initialized to '-'
await execute_action("game", {
    action: "reset",
    value: "-",
    width: 3,
    height: 3
});

// Reset the states for Player A and Player B
await execute_action("/api/core/v1/board/cardreset", { name: "Player A" });
await execute_action("/api/core/v1/board/cardreset", { name: "Player B" });

// Optionally reset the turn to the initial state, if needed
// await execute_action("turn", { action: 'reset' });