import { atom, useAtom } from 'jotai'

export const highlightedCard = atom("")

export const useHighlightedCard = () => {
    return useAtom(highlightedCard)
}

export const isHighlightedCard = (board, card: string) => {
    const [highlightedCard] = useHighlightedCard()
    return highlightedCard === board + '/' + card
}