await execute_action("stats", {
    "action": "clear"
})

await execute_action("stats", {
	key: 'Player A', // key
	value: 0, // value
	action: 'set'
})

await execute_action("stats", {
	key: 'Player B', // key
	value: 0, // value
	action: 'set'
})

await execute_action("stats", {
	key: 'Draw', // key
	value: 0, // value
	action: 'set'
})