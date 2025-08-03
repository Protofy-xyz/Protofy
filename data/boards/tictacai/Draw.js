// This code checks if the stats object exists and is not empty; if it is empty, it executes the 'reset stats' action. 
// Then, it adds 1 to the number of draws in the stats object, under the key 'Draw'. Both actions are meant to keep track of and update game statistics.

if (!board.stats || Object.keys(board.stats).length === 0) {
    await execute_action("reset stats");
}
await execute_action("stats", {key: "Draw", value: "1"});
return null;