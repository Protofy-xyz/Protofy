await execute_action("game", {
	action: 'reset', // reset or setCell
	value: ' ', // initialization value when using reset, value for cell when using setCell
	width: 3, // width of the matrix: needed for reset
	height: 3, // height of the matrix: needed for reset
})