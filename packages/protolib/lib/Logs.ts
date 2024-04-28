import { SetStateAction, atom, useAtom } from 'jotai';

export const LogMessages = atom([])

export const useLogMessages = () => {
    const [messages, setMessages] = useAtom<any>(LogMessages)
    return [messages, setMessages]
}