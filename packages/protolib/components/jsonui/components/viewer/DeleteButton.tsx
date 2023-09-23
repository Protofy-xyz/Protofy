import { MinusSquare, Trash, X, XCircle, XSquare } from "@tamagui/lucide-icons"
import { Stack } from "tamagui"

export const DeleteButton = ({onPress}) => (
    <Stack width="min-content" onPress={onPress} opacity={0.4} hoverStyle={{opacity:1}} top={2} display="inline">
        <Trash color={"var(--blue9)"} size={14} />
    </Stack>
)