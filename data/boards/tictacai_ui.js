//@card/react
//board is the board object
//state is the state of the board

function Widget({board, state}) {
    const cards = board.cards.reduce((total, card) => {
        return {
            ...total,
            [card.name]: card
        }
    }, {})


    return <XStack gap="$5" width="100%" f={1}>
        Not implemented yet
    </XStack>
}
                